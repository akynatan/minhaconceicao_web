import styled, { css, keyframes } from "styled-components";

interface ContainerProps {
  isErrored: boolean;
}

interface UploadAreaProps {
  isDragOver: boolean;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-bottom: 16px;

  ${(props) =>
    props.isErrored &&
    css`
      .upload-area {
        border-color: #c53030;
      }
    `}
`;

export const UploadArea = styled.div<UploadAreaProps>`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;

  ${(props) =>
    props.isDragOver &&
    css`
      border-color: #007bff;
      background: rgba(0, 123, 255, 0.05);
    `}

  &:hover {
    border-color: #007bff;
    background: rgba(0, 123, 255, 0.02);
  }

  svg {
    color: #666666;
    margin-bottom: 16px;

    &.spinning {
      animation: ${spin} 1s linear infinite;
    }
  }
`;

export const UploadText = styled.p`
  font-size: 16px;
  color: #333333;
  margin: 0 0 8px 0;
  font-weight: 500;
`;

export const UploadHint = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 20px 0;
  line-height: 1.4;
`;

export const UploadButton = styled.button`
  background: #007bff;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

export const FileList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
  }

  svg {
    color: #666666;
    flex-shrink: 0;
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
    color: #333333;
    word-break: break-word;
  }

  .size {
    font-size: 12px;
    color: #666666;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }
`;

export const ErrorMessage = styled.span`
  color: #c53030;
  font-size: 14px;
  margin-top: 8px;
  display: block;
`;
