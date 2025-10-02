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

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputMaskComponent: React.FC<InputMaskProps> = ({
  name,
  mask,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!inputRef.current?.value);
  }, []);

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
        mask={mask}
        defaultValue={defaultValue}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
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

export default InputMaskComponent;
