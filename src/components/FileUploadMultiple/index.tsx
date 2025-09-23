import React, { useRef, useState, useCallback } from "react";
import { useField } from "@unform/core";
import { FiUpload, FiX, FiFile, FiLoader } from "react-icons/fi";
import api from "../../services/api";
import * as S from "./styles";

interface FileUploadMultipleProps {
  name: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // em MB
  onUploadSuccess?: (fileData: { key: string; name: string }) => void;
  onUploadError?: (error: string) => void;
}

interface FileData {
  key: string;
  name: string;
  file: File;
  preview?: string;
  isUploading?: boolean;
}

const FileUploadMultiple: React.FC<FileUploadMultipleProps> = ({
  name,
  placeholder = "Selecione arquivos ou arraste os arquivos aqui.",
  accept = "image/*",
  maxSize = 5, // 5MB default
  onUploadSuccess,
  onUploadError,
}) => {
  const { fieldName, defaultValue = [], error, registerField } = useField(name);
  const [files, setFiles] = useState<FileData[]>(defaultValue || []);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => {
        const validKeys = files
          .filter((f) => f.key && f.key.trim() !== "" && !f.isUploading)
          .map((f) => f.key);
        console.log("FileUploadMultiple - Valid keys:", validKeys);
        console.log("FileUploadMultiple - All files:", files);
        return validKeys;
      },
      setValue: (_, value) => {
        if (value && Array.isArray(value)) {
          // Se for array de strings (keys), mantém apenas as keys
          if (typeof value[0] === "string") {
            setFiles((prev) => prev.filter((f) => value.includes(f.key)));
          } else {
            // Se for array de File objects, converte para FileData
            const fileData = value.map((file: any) => ({
              key: "",
              name: file.name,
              file,
              preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
            }));
            setFiles(fileData);
          }
        }
      },
      clearValue: () => setFiles([]),
    });
  }, [fieldName, registerField, files]);

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

  const uploadFile = async (file: File, tempIndex: number) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { key, fileName } = response.data;

      const uploadedFileData: FileData = {
        key,
        name: fileName,
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        isUploading: false,
      };

      // Substitui o arquivo temporário pelo arquivo com key
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[tempIndex] = uploadedFileData;
        return newFiles;
      });

      if (onUploadSuccess) {
        onUploadSuccess({ key, name });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao fazer upload do arquivo";

      // Remove o arquivo que falhou no upload
      setFiles((prev) => prev.filter((_, index) => index !== tempIndex));

      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleFileSelect = useCallback(
    async (fileList: FileList) => {
      if (fileList.length === 0) return;

      const errors: string[] = [];
      const validFiles: File[] = [];

      const fileArray = Array.from(fileList) as File[];
      fileArray.forEach((file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }

      // Adiciona arquivos como "uploading" primeiro
      const uploadingFiles: FileData[] = validFiles.map((file) => ({
        key: "",
        name: file.name,
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        isUploading: true,
      }));

      const currentLength = files.length;
      setFiles((prev) => [...prev, ...uploadingFiles]);

      // Faz upload de cada arquivo
      for (let i = 0; i < validFiles.length; i++) {
        await uploadFile(validFiles[i], currentLength + i);
      }
    },
    [maxSize, accept, onUploadSuccess, onUploadError]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    if (inputRef.current) {
      inputRef.current.value = "";
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

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = files.some((file) => file.isUploading);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <S.Container ref={containerRef} isErrored={!!error}>
      <S.UploadArea
        isDragOver={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isUploading ? openFileDialog : undefined}
        style={{ cursor: isUploading ? "default" : "pointer" }}
      >
        {isUploading ? (
          <>
            <FiLoader size={32} className="spinning" />
            <S.UploadText>Fazendo upload...</S.UploadText>
          </>
        ) : (
          <>
            <FiUpload size={32} />
            <S.UploadText>{placeholder}</S.UploadText>
            <S.UploadHint>
              Formatos: {accept === "image/*" ? "PNG, JPG, GIF" : accept}
              <br />
              Tamanho: até {maxSize}MB por arquivo
            </S.UploadHint>
            <S.UploadButton type="button">Selecionar arquivos</S.UploadButton>
          </>
        )}
      </S.UploadArea>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        style={{ display: "none" }}
        disabled={isUploading}
      />

      {files.length > 0 && (
        <S.FileList>
          {files.map((fileData, index) => (
            <S.FileItem key={index}>
              {fileData.preview ? (
                <img src={fileData.preview} alt="Preview" />
              ) : (
                <FiFile size={24} />
              )}

              <S.FileInfo>
                <span className="name">{fileData.name}</span>
                <span className="size">
                  {fileData.isUploading
                    ? "Fazendo upload..."
                    : formatFileSize(fileData.file.size)}
                </span>
              </S.FileInfo>

              {!fileData.isUploading && (
                <S.RemoveButton
                  type="button"
                  onClick={() => removeFile(index)}
                  title="Remover arquivo"
                >
                  <FiX size={16} />
                </S.RemoveButton>
              )}
            </S.FileItem>
          ))}
        </S.FileList>
      )}

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.Container>
  );
};

export default FileUploadMultiple;
