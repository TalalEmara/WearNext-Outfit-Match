import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: React.ReactNode;
  styling?: string; // Optional custom className or styles
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  children,
  styling = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  type = "button",
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    styling,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={buttonClasses} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children || label}
    </button>
  );
};

export default Button;
