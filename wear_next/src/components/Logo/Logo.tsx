import React from "react";
import styles from "./Logo.module.css";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = false,
  taglineText = "Fashion Matcher",
  className = "",
  href = "/",
}) => {
  const content = (
    <div className={`${styles.logoContainer} ${styles[size]} ${className}`}>
      <div className={styles.iconWrapper}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized Modern Hanger / Fashion Monogram */}
          <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L3 13.5A2 2 0 0 0 4.5 17H19.5a2 2 0 0 0 1.5-3.5L14.2 7c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3z" />
          <line x1="9" y1="21" x2="15" y2="21" />
        </svg>
      </div>

      <div className={styles.textWrapper}>
        <span className={styles.brandName}>
          Wear<span className={styles.brandHighlight}>Next</span>
        </span>
        {showTagline && <span className={styles.tagline}>{taglineText}</span>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </a>
    );
  }

  return content;
};

export default Logo;
