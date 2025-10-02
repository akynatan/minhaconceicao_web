import React, { useState, useEffect, useRef } from "react";

import {
  Container,
  ScheduleItem,
  TimeInputs,
  TimeInput,
  ClosedToggle,
  DayLabel,
  ClosedLabel,
} from "./styles";

export interface ScheduleData {
  id?: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
  isClosed: boolean;
}

interface ScheduleFormProps {
  name?: string;
  schedules?: ScheduleData[];
  onChange?: (schedules: ScheduleData[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedules = [],
  onChange,
}) => {
  // Inicializa com todos os dias da semana se não houver schedules
  const [scheduleList, setScheduleList] = useState<ScheduleData[]>(() => {
    if (schedules.length > 0) {
      console.log(
        "ScheduleForm - Initializing with provided schedules:",
        schedules
      );
      return schedules;
    }

    // Cria um schedule para cada dia da semana
    const defaultSchedules = DAYS_OF_WEEK.map((day) => ({
      dayOfWeek: day.value,
      openingTime: "08:00",
      closingTime: "18:00",
      isClosed: false,
    }));
    console.log(
      "ScheduleForm - Initializing with default schedules:",
      defaultSchedules
    );
    return defaultSchedules;
  });

  // Atualizar scheduleList quando schedules prop mudar
  useEffect(() => {
    if (schedules.length > 0) {
      console.log(
        "ScheduleForm - Updating scheduleList from props:",
        schedules
      );
      setScheduleList(schedules);
    }
  }, [schedules]);

  const prevScheduleListRef = useRef<ScheduleData[]>([]);
  useEffect(() => {
    if (
      JSON.stringify(prevScheduleListRef.current) !==
      JSON.stringify(scheduleList)
    ) {
      prevScheduleListRef.current = scheduleList;
      if (onChange) {
        onChange(scheduleList);
      }
    }
  }, [scheduleList, onChange]);

  const updateSchedule = (
    dayOfWeek: number,
    field: keyof ScheduleData,
    value: any
  ) => {
    const newSchedules = [...scheduleList];
    const index = newSchedules.findIndex(
      (schedule) => schedule.dayOfWeek === dayOfWeek
    );
    if (index !== -1) {
      newSchedules[index] = { ...newSchedules[index], [field]: value };
      setScheduleList(newSchedules);
    } else {
      console.log("ScheduleForm - Schedule not found for day:", dayOfWeek);
    }
  };

  return (
    <Container>
      <h3>Horários de Funcionamento</h3>
      <p>Configure os horários de funcionamento para cada dia da semana</p>

      {DAYS_OF_WEEK.map((day) => {
        const schedule = scheduleList.find((s) => s.dayOfWeek === day.value);
        if (!schedule) return null;

        return (
          <ScheduleItem key={day.value}>
            <DayLabel>{day.label}</DayLabel>

            <ClosedToggle>
              <input
                type="checkbox"
                id={`closed-${day.value}`}
                checked={schedule.isClosed}
                onChange={(e) =>
                  updateSchedule(day.value, "isClosed", e.target.checked)
                }
              />
              <ClosedLabel htmlFor={`closed-${day.value}`}>Fechado</ClosedLabel>
            </ClosedToggle>

            {!schedule.isClosed && (
              <TimeInputs>
                <TimeInput
                  type="time"
                  value={schedule.openingTime}
                  lang="pt-BR"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSchedule(day.value, "openingTime", e.target.value)
                  }
                />
                <span>até</span>
                <TimeInput
                  type="time"
                  lang="pt-BR"
                  value={schedule.closingTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSchedule(day.value, "closingTime", e.target.value)
                  }
                />
              </TimeInputs>
            )}
          </ScheduleItem>
        );
      })}
    </Container>
  );
};

export default ScheduleForm;
