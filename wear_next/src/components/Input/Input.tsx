import React from "react";
import styles from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  hasError?: boolean;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  icon,
  hasError = false,
  wrapperClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`${styles.inputWrapper} ${
        hasError ? styles.hasError : ""
      } ${wrapperClassName}`}
    >
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <input className={`${styles.inputField} ${className}`} {...props} />
    </div>
  );
};

export default Input;
