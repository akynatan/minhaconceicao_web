import React, {
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { IconBaseProps } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";
import { useField } from "@unform/core";
import ReactSelect, { StylesConfig } from "react-select";
import ReactSelectCreatable from "react-select/creatable";

import { Container, Error } from "./styles";

interface Option {
  label: string | number;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  placeholder: string;
  options: Option[];
  containerStyle?: object;
  isDisabled?: boolean;
  isMulti?: boolean;
  defaultValue?: any;
  component?: "creatable" | "default";
  icon?: React.ComponentType<IconBaseProps>;
}

const Select: React.FC<SelectProps> = ({
  name,
  placeholder,
  options,
  containerStyle = {},
  isDisabled = false,
  isMulti = false,
  component = "default",
  icon: Icon,
  onChange,
}) => {
  const selectRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!selectRef.current);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: undefined,
      getValue: (ref: any) => {
        if (ref.state.selectValue.length) {
          if (isMulti) {
            return ref.state.selectValue.map((sel: any) => sel.value);
          }

          return ref.state.selectValue[0].value;
        }
        return "";
      },
      setValue: (ref: any, value: any) => {
        ref.setValue(value);
        return value;
      },
    });

    // Convert defaultValue to the format expected by ReactSelect
    if (defaultValue && selectRef?.current) {
      let selectValue;

      if (isMulti) {
        // For multi-select, defaultValue should be an array of values
        const values = Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue];
        selectValue = values.map(
          (val) =>
            options.find((opt) => opt.value === val) || {
              value: val,
              label: val,
            }
        );
      } else {
        // For single select, find the matching option
        const option = options.find((opt) => opt.value === defaultValue);
        selectValue = option
          ? [option]
          : [{ value: defaultValue, label: defaultValue }];
      }

      selectRef.current.setValue(selectValue);
    }
  }, [fieldName, isMulti, defaultValue, registerField, options]);

  const styles: StylesConfig = {
    option: (provided, state) => {
      return {
        ...provided,
        backgroundColor: state.isSelected ? "#007bff" : "#ffffff",
        color: state.isSelected ? "#ffffff" : "#333333",
        cursor: "pointer",
        padding: "12px 16px",
        fontSize: "16px",
        textAlign: "left",
        borderBottom: "1px solid #f0f0f0",
        "&:hover": {
          backgroundColor: state.isSelected ? "#0056b3" : "#f8f9fa",
        },
      };
    },
    menu: (provided) => {
      return {
        ...provided,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
      };
    },
    menuList: (provided) => {
      return {
        ...provided,
        padding: "8px 0",
        maxHeight: "200px",
      };
    },
    container: (provided) => {
      return {
        ...provided,
        border: 0,
        borderRadius: "8px",
        width: "100%",
      };
    },
    control: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;

      return {
        ...provided,
        backgroundColor: "#ffffff",
        color: "#333333",
        width: "100%",
        opacity,
        minHeight: "48px",
        border: state.isFocused ? "2px solid #007bff" : "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "left",
        boxShadow: state.isFocused
          ? "0 0 0 3px rgba(0, 123, 255, 0.25)"
          : "none",
        "&:hover": {
          borderColor: state.isFocused ? "#007bff" : "#999999",
        },
      };
    },
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return {
        ...provided,
        opacity,
        transition,
        color: "#333333",
        fontSize: "16px",
      };
    },
    placeholder: (provided) => {
      return {
        ...provided,
        color: "#999999",
        fontSize: "16px",
      };
    },
    indicatorSeparator: () => {
      return {
        display: "none",
      };
    },
    dropdownIndicator: (provided, state) => {
      return {
        ...provided,
        color: state.isFocused ? "#007bff" : "#666666",
        "&:hover": {
          color: "#007bff",
        },
      };
    },
  };

  const Components = {
    creatable: (
      <ReactSelectCreatable
        ref={selectRef}
        name={name}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        isSearchable
        styles={styles}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        onChange={onChange}
      />
    ),
    default: (
      <ReactSelect
        ref={selectRef}
        name={name}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        isSearchable
        styles={styles}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        onChange={onChange}
      />
    ),
  };

  const Component: JSX.Element | React.ReactNode | React.FunctionComponent =
    Components[component];

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isField={isField}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}

      {Component}

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
