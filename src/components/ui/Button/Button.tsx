"use client";

import { ButtonHTMLAttributes } from "react";
import { buttonClassName, ButtonVariant } from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} {...rest}>
      {children}
    </button>
  );
}