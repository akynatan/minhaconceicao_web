import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div<{ isErrored?: boolean }>`
  width: 100%;
  margin-bottom: 16px;

  ${(props) =>
    props.isErrored &&
    `
    .upload-area {
      border-color: #dc3545;
    }
  `}
`;

export const UploadArea = styled.div<{ isDragOver?: boolean }>`
  border: 2px dashed ${(props) => (props.isDragOver ? "#007bff" : "#ddd")};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: ${(props) => (props.isDragOver ? "#f8f9fa" : "#fff")};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }

  svg {
    color: #6c757d;
    margin-bottom: 16px;
  }
`;

export const UploadButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const UploadText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

export const UploadHint = styled.div`
  font-size: 14px;
  color: #6c757d;
  line-height: 1.4;
`;

export const FileList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  gap: 12px;

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }

  svg {
    color: #6c757d;
  }
`;

export const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    word-break: break-word;
  }

  .size {
    font-size: 12px;
    color: #6c757d;
  }
`;

export const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
`;

export const Spinner = styled.div`
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

// Adicionar a classe spinning globalmente
export const GlobalStyles = styled.div`
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;
