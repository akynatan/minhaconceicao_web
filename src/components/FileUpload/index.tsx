import React, { useRef, useState, useCallback } from "react";
import { useField } from "@unform/core";
import { FiUpload, FiX, FiFile, FiLoader } from "react-icons/fi";
import api from "../../services/api";
import {
  Container,
  UploadArea,
  UploadButton,
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
  existingPhoto?: { key: string; photoUrl: string }; // Foto existente para edição
  onUploadSuccess?: (fileData: {
    key: string;
    name: string;
    imageUrl: string;
  }) => void;
  onUploadError?: (error: string) => void;
}

interface UploadedFileData {
  key: string;
  name: string;
  file?: File;
  preview?: string;
  photoUrl?: string; // URL da foto existente (para edição)
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  placeholder = "Selecione um arquivo ou arraste o arquivo aqui.",
  accept = "image/*",
  maxSize = 5, // 5MB default
  existingPhoto,
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

  // Carrega foto existente quando o componente é montado
  React.useEffect(() => {
    if (existingPhoto) {
      const existingFileData: UploadedFileData = {
        key: existingPhoto.key,
        name: "Foto existente",
        photoUrl: existingPhoto.photoUrl,
      };
      setUploadedFile(existingFileData);
    } else {
      setUploadedFile(null);
    }
  }, [existingPhoto]);

  React.useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => {
        return uploadedFile?.key || "";
      },
      setValue: (_, value) => {
        if (value && typeof value === "string") {
          setUploadedFile((prev) =>
            prev ? { ...prev, key: value } : { key: value, name: "Arquivo" }
          );
        }
      },
      clearValue: () => {
        setUploadedFile(null);
      },
    });
  }, [fieldName, registerField]);

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

      const { key, fileName, imageUrl } = response.data;

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
        onUploadSuccess({ key, name, imageUrl });
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
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {uploadedFile.photoUrl ? (
              <img
                src={uploadedFile.photoUrl}
                alt="Foto existente"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            ) : uploadedFile.preview ? (
              <img
                src={uploadedFile.preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            ) : (
              <FiFile size={64} />
            )}
            <RemoveButton
              type="button"
              onClick={removeFile}
              title="Remover arquivo"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(255, 255, 255, 0.95)",
                color: "#e53e3e",
                border: "2px solid #e53e3e",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e53e3e";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.color = "#e53e3e";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiX size={18} />
            </RemoveButton>
          </div>
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

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default FileUpload;
