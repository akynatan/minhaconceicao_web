import { Link } from "react-router";
import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

export const CardBody = styled.div`
  margin-bottom: 16px;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

export const JobTitle = styled.h3`
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.2;
`;

export const CompanyInfo = styled.div`
  color: #666666;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const StatusIndicator = styled.span<{ isActive: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.isActive ? "#e8f5e8" : "#ffeaea")};
  color: ${(props) => (props.isActive ? "#2e7d32" : "#d32f2f")};
`;

export const CompanyLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DefaultLogo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f2fd;
  color: #1976d2;
`;

export const JobInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666666;

  svg {
    flex-shrink: 0;
    color: #999999;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const JobDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const DetailItem = styled.div`
  font-size: 13px;
  color: #555555;

  strong {
    color: #333333;
    font-weight: 600;
  }
`;

export const SalaryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e8f5e8;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  width: fit-content;

  svg {
    color: #2e7d32;
  }
`;

export const ApplicationInfo = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #f0f8ff;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;

  strong {
    color: #1976d2;
    font-weight: 600;
  }
`;

export const StatusSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;

  label {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    cursor: pointer;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 24px;

      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    }

    input:checked + .slider {
      background-color: #007bff;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }
  }
`;

export const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #007bff;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
    color: #ffffff;
  }

  svg {
    flex-shrink: 0;
  }
`;
