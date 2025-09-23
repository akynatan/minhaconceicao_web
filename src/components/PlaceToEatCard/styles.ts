import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const PlaceName = styled.h3`
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 12px;
`;

interface StatusIndicatorProps {
  isActive: boolean;
}

export const StatusIndicator = styled.span<StatusIndicatorProps>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.isActive ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.isActive ? "#155724" : "#721c24")};
`;

export const CardBody = styled.div`
  margin-bottom: 16px;
`;

export const PlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666666;
  font-size: 14px;

  svg {
    color: #007bff;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
`;

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

export const CategoryBadge = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

export const StatusSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

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

  span {
    font-size: 14px;
    color: #666666;
  }
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  svg {
    flex-shrink: 0;
  }
`;
