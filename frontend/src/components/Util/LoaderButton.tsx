import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

interface LoaderButton {
  isLoading: boolean
  className: string
  disabled: boolean
}
export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}: React.PropsWithChildren<LoaderButton>) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}
