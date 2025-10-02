import React, { InputHTMLAttributes, useRef, useEffect } from "react";
import { useField } from "@unform/core";

import { Container, TextareaElement, Error } from "./styles";

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  placeholder,
  icon: Icon,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textareaRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <div className="textarea-container">
        {Icon && (
          <div className="icon-container">
            <Icon size={20} color="#999" />
          </div>
        )}
        <TextareaElement
          id={fieldName}
          ref={textareaRef}
          defaultValue={defaultValue}
          placeholder={placeholder}
          hasIcon={!!Icon}
          {...rest}
        />
      </div>
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default Textarea;
