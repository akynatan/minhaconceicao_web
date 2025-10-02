import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { IconBaseProps } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";
import { useField } from "@unform/core";
import InputMask from "react-input-mask";

import { Container, Error } from "../Input/styles";

interface InputPhoneProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputPhone: React.FC<InputPhoneProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);
  const [currentMask, setCurrentMask] = useState("(99) 9999-9999");
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!inputRef.current?.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentValue = inputRef.current?.value || "";
      const rawValue = currentValue.replace(/\D/g, "");

      if (rawValue.length === 10 && /[0-9]/.test(e.key)) {
        setCurrentMask("(99) 99999-9999");
      }
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");

      if (rawValue.length <= 10) {
        setCurrentMask("(99) 9999-9999");
      }

      if (rest.onChange) {
        rest.onChange(e);
      }
    },
    [rest]
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isField={isField}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <InputMask
        mask={currentMask}
        defaultValue={defaultValue}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={rest.placeholder}
        type={rest.type}
        disabled={rest.disabled}
        readOnly={rest.readOnly}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default InputPhone;
