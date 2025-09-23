import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useField } from "@unform/core";
import { Container, ErrorMessage } from "./styles";

interface RichTextEditorProps {
  name: string;
  placeholder?: string;
  style?: React.CSSProperties;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  placeholder,
  style,
  ...rest
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const { fieldName, defaultValue, error, registerField, clearError } =
    useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: quillRef.current,
      getValue: () => {
        return quillRef.current?.getEditor().root.innerHTML || "";
      },
      setValue: (ref, value) => {
        if (ref && value) {
          ref.getEditor().root.innerHTML = value;
        }
      },
      clearValue: () => {
        if (quillRef.current) {
          quillRef.current.getEditor().setText("");
        }
      },
    });
  }, [fieldName, registerField]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <Container style={style} isErrored={!!error}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        defaultValue={defaultValue}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        onFocus={clearError}
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default RichTextEditor;
