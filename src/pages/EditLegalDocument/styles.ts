import styled from "styled-components";

export const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 0 0 24px;

  div {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
  }

  dt {
    font-size: 12px;
    color: #666666;
    margin-bottom: 4px;
  }

  dd {
    margin: 0;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }
`;

export const DocumentTitle = styled.h2`
  margin: 0 0 16px;
  color: #333333;
  font-size: 22px;
  font-weight: 600;
`;

export const ContentLabel = styled.h3`
  margin: 0 0 8px;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
`;

export const PublishedActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  button {
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;
