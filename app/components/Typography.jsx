"use client"

import styles from "./Typography.module.css"

/**
 * Semantic typography components: all use design tokens from globals.css.
 * Use for new sections or refactoring; existing page styles still use page.module.css.
 */

export function H1({ children, className = "", as: Component = "h1", ...props }) {
  return (
    <Component className={`${styles.h1} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function H2({ children, className = "", as: Component = "h2", ...props }) {
  return (
    <Component className={`${styles.h2} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function H3({ children, className = "", as: Component = "h3", ...props }) {
  return (
    <Component className={`${styles.h3} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function H4({ children, className = "", as: Component = "h4", ...props }) {
  return (
    <Component className={`${styles.h4} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function Text({
  children,
  className = "",
  as: Component = "p",
  variant = "body",
  ...props
}) {
  const variantClass =
    variant === "bodyLg"
      ? styles.bodyLg
      : variant === "bodySm"
        ? styles.bodySm
        : variant === "caption"
          ? styles.caption
          : styles.body
  return (
    <Component className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function Label({ children, className = "", as: Component = "span", ...props }) {
  return (
    <Component className={`${styles.label} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function HelperText({
  children,
  className = "",
  as: Component = "p",
  ...props
}) {
  return (
    <Component className={`${styles.helper} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}

export function Overline({ children, className = "", as: Component = "span", ...props }) {
  return (
    <Component className={`${styles.overline} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
