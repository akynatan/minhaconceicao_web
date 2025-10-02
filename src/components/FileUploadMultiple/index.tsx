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
  existingImages?: Array<{ key: string; imageUrl: string; name?: string }>; // Imagens existentes para edição
  onUploadSuccess?: (fileData: { key: string; name: string }) => void;
  onUploadError?: (error: string) => void;
}

interface FileData {
  key: string; // Usar a key como identificador único
  name: string;
  file?: File;
  imageUrl?: string; // URL da imagem (retornada pelo backend ou existente)
  isUploading?: boolean;
}

const FileUploadMultiple: React.FC<FileUploadMultipleProps> = ({
  name,
  placeholder = "Selecione arquivos ou arraste os arquivos aqui.",
  accept = "image/*",
  maxSize = 5, // 5MB default
  existingImages = [],
  onUploadSuccess,
  onUploadError,
}) => {
  const { fieldName, defaultValue = [], error, registerField } = useField(name);
  const [files, setFiles] = useState<FileData[]>(defaultValue || []);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega imagens existentes quando o componente é montado
  React.useEffect(() => {
    if (existingImages.length > 0) {
      const existingFiles: FileData[] = existingImages.map((img) => ({
        key: img.key,
        name: img.name || img.key,
        imageUrl: img.imageUrl,
        isUploading: false,
      }));
      setFiles(existingFiles);
    }
  }, [existingImages]);

  React.useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => {
        const validKeys = files
          .filter((f) => f.key && f.key.trim() !== "" && !f.isUploading)
          .map((f) => f.key);
        return validKeys;
      },
      setValue: (_, value) => {
        if (value && Array.isArray(value)) {
          if (typeof value[0] === "string") {
            setFiles((prev) => prev.filter((f) => value.includes(f.key)));
          } else {
            const fileData = value.map((file: any) => ({
              key: `temp-${Date.now()}-${Math.random()}`,
              name: file.name,
              file,
              imageUrl: file.imageUrl,
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

  const uploadFile = async (file: File, tempKey: string) => {
    console.log(
      `FileUploadMultiple - Starting upload for file: ${file.name} with temp key: ${tempKey}`
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log(`FileUploadMultiple - Uploading file: ${file.name}`);
      const response = await api.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { key, fileName, imageUrl } = response.data;
      console.log(
        `FileUploadMultiple - Upload successful for: ${file.name}, key: ${key}, imageUrl: ${imageUrl}`
      );

      const uploadedFileData: FileData = {
        key,
        name: fileName,
        file,
        imageUrl: imageUrl, // Usar imageUrl do backend como preview
        isUploading: false,
      };

      setFiles((prev) => {
        console.log(
          `FileUploadMultiple - Updating file with temp key ${tempKey}`
        );

        // Encontrar e substituir o arquivo pela key temporária
        const updatedFiles = prev.map((file) => {
          if (file.key === tempKey) {
            console.log(`FileUploadMultiple - File updated successfully`);
            return uploadedFileData;
          }
          return file;
        });

        // Se não encontrou, adicionar no final (fallback)
        if (!prev.some((f) => f.key === tempKey)) {
          console.error(
            `FileUploadMultiple - Could not find file with temp key ${tempKey}, adding to end`
          );
          updatedFiles.push(uploadedFileData);
        }

        return updatedFiles;
      });

      if (onUploadSuccess) {
        onUploadSuccess({ key, name: fileName });
      }
    } catch (error: any) {
      console.error(
        `FileUploadMultiple - Upload error for file: ${file.name}`,
        error
      );
      const errorMessage =
        error.response?.data?.message || "Erro ao fazer upload do arquivo";

      setFiles((prev) => {
        console.log(
          `FileUploadMultiple - Removing failed upload with temp key: ${tempKey}`
        );
        return prev.filter((f) => f.key !== tempKey);
      });

      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleFileSelect = useCallback(
    async (fileList: FileList) => {
      console.log(
        "FileUploadMultiple - handleFileSelect called with",
        fileList.length,
        "files"
      );

      if (fileList.length === 0) return;

      const errors: string[] = [];
      const validFiles: File[] = [];

      const fileArray = Array.from(fileList) as File[];
      console.log(
        "FileUploadMultiple - Processing files:",
        fileArray.map((f) => f.name)
      );

      fileArray.forEach((file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        console.error("FileUploadMultiple - Validation errors:", errors);
        alert(errors.join("\n"));
      }

      console.log("FileUploadMultiple - Valid files:", validFiles.length);

      const uploadingFiles: FileData[] = validFiles.map((file, index) => ({
        key: `temp-${Date.now()}-${index}`, // Key temporária para identificar durante upload
        name: file.name,
        file,
        imageUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file) // Preview temporário do arquivo local
          : undefined,
        isUploading: true,
      }));

      // Adicionar arquivos em estado de upload
      setFiles((prev) => {
        console.log("FileUploadMultiple - Current files length:", prev.length);
        console.log(
          "FileUploadMultiple - Adding uploading files:",
          uploadingFiles.length
        );

        const newFiles = [...prev, ...uploadingFiles];
        console.log("FileUploadMultiple - New files state:", newFiles.length);

        return newFiles;
      });

      // Fazer uploads sequenciais para evitar problemas de concorrência
      for (let i = 0; i < validFiles.length; i++) {
        console.log(
          `FileUploadMultiple - Uploading file ${i + 1}/${validFiles.length}:`,
          validFiles[i].name
        );
        await uploadFile(validFiles[i], uploadingFiles[i].key);
      }
    },
    [maxSize, accept, onUploadSuccess, onUploadError]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      handleFileSelect(fileList);
    }

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

  const removeFile = (fileKey: string) => {
    const fileToRemove = files.find((f) => f.key === fileKey);
    // Revogar URL do preview temporário se existir
    if (fileToRemove?.imageUrl && fileToRemove.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.imageUrl);
    }
    setFiles((prev) => prev.filter((f) => f.key !== fileKey));
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
          {files.map((fileData) => (
            <S.FileItem key={fileData.key}>
              {fileData.imageUrl ? (
                <img
                  src={fileData.imageUrl}
                  alt={fileData.isUploading ? "Preview" : "Imagem"}
                />
              ) : (
                <FiFile size={24} />
              )}

              <S.FileInfo>
                <span className="name">{fileData.name}</span>
                <span className="size">
                  {fileData.isUploading
                    ? "Fazendo upload..."
                    : fileData?.file?.size
                    ? formatFileSize(fileData?.file?.size)
                    : fileData.imageUrl &&
                      !fileData.imageUrl.startsWith("blob:")
                    ? "Imagem existente"
                    : "0 Bytes"}
                </span>
              </S.FileInfo>

              {!fileData.isUploading && (
                <S.RemoveButton
                  type="button"
                  onClick={() => removeFile(fileData.key)}
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
