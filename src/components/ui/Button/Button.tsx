import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type ButtonSize = "sm" | "md" | "lg";

// ---- Base props shared by all button forms ----
interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

// ---- <button> element ----
interface ButtonElementProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "children"> {
  as?: "button";
  href?: never;
}

// ---- <a> element via Next.js Link ----
interface LinkElementProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "children"> {
  as: "link";
  href: string;
}

type ButtonProps = ButtonElementProps | LinkElementProps;

// ---- Helper: build className string ----
function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  loading: boolean,
  extra?: string
): string {
  const classes = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth ? styles["button--full"] : "",
    loading ? styles["button--loading"] : "",
    extra ?? "",
  ];
  return classes.filter(Boolean).join(" ");
}

// ---- Component ----
export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = "left",
    children,
    className,
    ...rest
  } = props;

  const cn = buildClassName(variant, size, fullWidth, loading, className);

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (props.as === "link") {
    const { as: _as, href, ...linkRest } = rest as LinkElementProps;
    return (
      <Link href={href} className={cn} {...linkRest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn}
      disabled={loading || (rest as ButtonElementProps).disabled}
      aria-busy={loading}
      {...(rest as ButtonElementProps)}
    >
      {content}
    </button>
  );
}
