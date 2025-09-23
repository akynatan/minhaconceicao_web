import React, {
  InputHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from "react";
import { IconBaseProps } from "react-icons";

import { Container } from "./styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
  onBlurFunction?: (value: string) => void;
}

const InputSample: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  onBlurFunction,
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!inputRef.current?.value);
    onBlurFunction && onBlurFunction(inputRef.current?.value || "");
  }, [inputRef, onBlurFunction]);

  const handleInputPressKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        inputRef.current?.blur();
      }
    },
    [inputRef]
  );

  return (
    <Container
      style={containerStyle}
      isField={isField}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        name={name}
        {...rest}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyPress={handleInputPressKey}
      />
    </Container>
  );
};

export default InputSample;
