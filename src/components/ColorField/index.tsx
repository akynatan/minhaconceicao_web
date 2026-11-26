import React, { useEffect, useRef, useState } from "react";
import { useField } from "@unform/core";

import { isHexColor, normalizeHex } from "../../utils/hexColor";

import { ErrorText, Field, Label, Row } from "./styles";

interface ColorFieldProps {
  name: string;
  label: string;
  fallback: string;
  onChange?: (value: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({
  name,
  label,
  fallback,
  onChange,
}) => {
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const initial = normalizeHex(
    typeof defaultValue === "string" ? defaultValue : "",
    fallback
  );
  const [value, setValue] = useState(initial);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => valueRef.current,
      setValue: (_ref, nextValue) => {
        const next = typeof nextValue === "string" ? nextValue : "";
        setValue(isHexColor(next) ? normalizeHex(next, fallback) : next);
      },
      clearValue: () => setValue(fallback),
    });
  }, [fallback, fieldName, registerField]);

  return (
    <Field>
      <Label htmlFor={fieldName}>{label}</Label>
      <Row $errored={!!error}>
        <input
          type="color"
          aria-label={label}
          value={isHexColor(value) ? value : fallback}
          onChange={(event) => {
          const next = normalizeHex(event.target.value, fallback);
          setValue(next);
          onChange?.(next);
        }}
        />
        <input
          id={fieldName}
          type="text"
          value={value}
          spellCheck={false}
          maxLength={7}
          onChange={(event) => {
            const next = event.target.value.toUpperCase();
            setValue(next);
            onChange?.(next);
          }}
          onBlur={() => {
            if (isHexColor(value)) {
              setValue(normalizeHex(value, fallback));
            }
          }}
        />
      </Row>
      {error && <ErrorText>{error}</ErrorText>}
    </Field>
  );
};

export default ColorField;
