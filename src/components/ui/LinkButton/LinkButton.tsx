import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import { buttonClassName, ButtonVariant } from "../Button/buttonStyles";

type LinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
  };

export default function LinkButton({
  variant = "primary",
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={buttonClassName(variant, className)} {...rest}>
      {children}
    </Link>
  );
}