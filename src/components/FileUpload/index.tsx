import React, { useRef, useState, useCallback } from "react";
import { useField } from "@unform/core";
import { FiUpload, FiX, FiFile, FiLoader } from "react-icons/fi";
import api from "../../services/api";
import {
  Container,
  UploadArea,
  UploadButton,
  FileList,
  FileItem,
  FileInfo,
  RemoveButton,
  UploadText,
  UploadHint,
  ErrorMessage,
} from "./styles";

interface FileUploadProps {
  name: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // em MB
  onUploadSuccess?: (fileData: { key: string; name: string }) => void;
  onUploadError?: (error: string) => void;
}

interface UploadedFileData {
  key: string;
  name: string;
  file: File;
  preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  placeholder = "Selecione um arquivo ou arraste o arquivo aqui.",
  accept = "image/*",
  maxSize = 5, // 5MB default
  onUploadSuccess,
  onUploadError,
}) => {
  const {
    fieldName,
    defaultValue = null,
    error,
    registerField,
  } = useField(name);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(
    defaultValue
  );
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => uploadedFile?.key || "",
      setValue: (_, value) => {
        if (value) {
          // Se for uma string (key), mantém apenas a key
          if (typeof value === "string") {
            setUploadedFile((prev) => (prev ? { ...prev, key: value } : null));
          }
        }
      },
      clearValue: () => setUploadedFile(null),
    });
  }, [fieldName, registerField, uploadedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`;
    }

    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      return "Tipo de arquivo não permitido";
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { key, fileName } = response.data;

      const uploadedFileData: UploadedFileData = {
        key,
        name: fileName,
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      };

      setUploadedFile(uploadedFileData);

      if (onUploadSuccess) {
        onUploadSuccess({ key, name });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao fazer upload do arquivo";

      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = useCallback(
    async (fileList: FileList) => {
      if (fileList.length === 0) return;

      // Pega apenas o primeiro arquivo (upload único)
      const file = fileList[0];
      const validationError = validateFile(file);

      if (validationError) {
        if (onUploadError) {
          onUploadError(`${file.name}: ${validationError}`);
        } else {
          alert(`${file.name}: ${validationError}`);
        }
        return;
      }

      // Faz o upload imediatamente
      await uploadFile(file);
    },
    [maxSize, accept, onUploadError]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const fileList = event.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <Container ref={containerRef} isErrored={!!error}>
      <UploadArea
        isDragOver={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isUploading && !uploadedFile ? openFileDialog : undefined}
        style={{ cursor: isUploading || uploadedFile ? "default" : "pointer" }}
      >
        {isUploading ? (
          <>
            <FiLoader size={32} className="spinning" />
            <UploadText>Fazendo upload...</UploadText>
          </>
        ) : uploadedFile ? (
          <>
            <FiFile size={32} />
            <UploadText>Arquivo enviado com sucesso!</UploadText>
            <UploadHint>{uploadedFile.name}</UploadHint>
          </>
        ) : (
          <>
            <FiUpload size={32} />
            <UploadText>{placeholder}</UploadText>
            <UploadHint>
              Formatos:{" "}
              {accept === "image/*" ? "DOCX, PDF, GIF, PNG ou JPG" : accept}
              <br />
              Tamanho: até {maxSize}MB
            </UploadHint>
            <UploadButton type="button">Selecionar arquivo</UploadButton>
          </>
        )}
      </UploadArea>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: "none" }}
        disabled={isUploading || !!uploadedFile}
      />

      {uploadedFile && (
        <FileList>
          <FileItem>
            {uploadedFile.preview ? (
              <img src={uploadedFile.preview} alt="Preview" />
            ) : (
              <FiFile size={24} />
            )}

            <FileInfo>
              <span className="name">{uploadedFile.name}</span>
              <span className="size">
                {formatFileSize(uploadedFile.file.size)}
              </span>
            </FileInfo>

            <RemoveButton
              type="button"
              onClick={removeFile}
              title="Remover arquivo"
            >
              <FiX size={16} />
            </RemoveButton>
          </FileItem>
        </FileList>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default FileUpload;
