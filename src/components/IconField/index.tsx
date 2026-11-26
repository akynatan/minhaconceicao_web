import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useField } from "@unform/core";

import { loadLucideCatalog, toLucideKebab } from "../../utils/lucideIcons";
import { isLucideNativeIcon } from "../../utils/lucideNativeIcons";
import LucideIcon from "../LucideIcon";

import {
  ChooseButton,
  Dialog,
  ErrorText,
  Field,
  Hint,
  Label,
  Overlay,
  PlaceholderIcon,
  Preview,
  Row,
  Warning,
} from "./styles";

const IconPicker = lazy(() => import("../IconPicker"));

interface IconFieldProps {
  name: string;
  color?: string;
  background?: string;
}

const IconField: React.FC<IconFieldProps> = ({
  name,
  color = "#198653",
  background = "#E6F4EE",
}) => {
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [recognized, setRecognized] = useState<boolean | null>(null);
  const [compatible, setCompatible] = useState<boolean | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => valueRef.current,
      setValue: (_ref, nextValue) => {
        setValue(typeof nextValue === "string" ? nextValue : "");
      },
      clearValue: () => setValue(""),
    });
  }, [fieldName, registerField]);

  useEffect(() => {
    let active = true;
    const kebab = toLucideKebab(value);

    if (!value) {
      setRecognized(null);
      setCompatible(null);
      return;
    }

    const native = isLucideNativeIcon(value.trim());
    setCompatible(native);

    if (!kebab) {
      setRecognized(false);
      return;
    }

    loadLucideCatalog()
      .then(({ known }) => {
        if (active) {
          setRecognized(known.has(kebab));
        }
      })
      .catch(() => {
        if (active) {
          setRecognized(false);
        }
      });

    return () => {
      active = false;
    };
  }, [value]);

  const close = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback((pascalName: string) => {
    setValue(pascalName);
    setOpen(false);
  }, []);

  return (
    <Field>
      <Label>Ícone</Label>
      <Row>
        <Preview $background={background} $color={color}>
          {value && recognized !== false ? (
            <LucideIcon name={value} size={24} color={color} />
          ) : (
            <PlaceholderIcon />
          )}
          <span>{value || "Nenhum ícone"}</span>
        </Preview>
        <ChooseButton type="button" onClick={() => setOpen(true)}>
          Escolher ícone
        </ChooseButton>
      </Row>
      <Hint>
        Nome Lucide em PascalCase que existe no aplicativo, como Pizza ou
        UtensilsCrossed.
      </Hint>
      {compatible === false && (
        <Warning>
          Este ícone não existe no aplicativo. Escolha outro para o app
          conseguir desenhar.
        </Warning>
      )}
      {compatible !== false && recognized === false && (
        <Warning>
          Este valor não é um ícone Lucide. Escolha um novo para o aplicativo
          desenhar o ícone.
        </Warning>
      )}
      {error && <ErrorText>{error}</ErrorText>}

      {open &&
        createPortal(
          <Overlay
            onClick={close}
            role="presentation"
          >
            <Dialog
              role="dialog"
              aria-modal="true"
              aria-label="Escolher ícone"
              onClick={(event) => event.stopPropagation()}
            >
              <Suspense fallback={<p>Carregando ícones...</p>}>
                <IconPicker
                  selected={value}
                  onSelect={handleSelect}
                  onClose={close}
                />
              </Suspense>
            </Dialog>
          </Overlay>,
          document.body
        )}
    </Field>
  );
};

export default IconField;
