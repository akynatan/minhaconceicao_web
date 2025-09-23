import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-bottom: 24px;

  h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

export const ScheduleItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const DayLabel = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  min-width: 120px;
  flex-shrink: 0;
`;

export const ClosedToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #007bff;
  }
`;

export const ClosedLabel = styled.label`
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;
`;

export const TimeInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  span {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const TimeInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  color: #333;
  width: 100px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  @media (max-width: 480px) {
    width: 90px;
  }
`;
