import {CSSProperties} from "react";
import {theme} from "./theme";
import * as React from "react";

const {colors} = theme;

export const styles = {
    main: {
        backgroundColor: colors.background,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        margin: 0,
        padding: "24px 0",
    } satisfies CSSProperties,

    container: {
        maxWidth: "480px",
        margin: "0 auto",
        padding: "0 16px",
    } satisfies CSSProperties,

    card: {
        backgroundColor: colors.card,
        borderRadius: "10px",
        border: `1px solid ${colors.border}`,
        padding: "36px 32px",
    } satisfies CSSProperties,

    logoSection: {
        textAlign: "center",
        padding: "8px 0 20px",
    } satisfies CSSProperties,

    logo: {
        display: "block",
        margin: "0 auto",
        outline: "none",
        border: "none",
        textDecoration: "none"
    } satisfies CSSProperties,

    logoPlaceholder: {
        display: "inline-block",
        padding: "10px 20px",
        border: `1px dashed ${colors.border}`,
        borderRadius: "6px",
    } satisfies CSSProperties,

    logoPlaceholderText: {
        color: colors.primary,
        fontSize: "18px",
        fontWeight: 700,
        letterSpacing: "2px",
        margin: 0,
    } satisfies CSSProperties,

    eyebrow: {
        color: colors.accent,
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        margin: "0 0 8px",
    } satisfies CSSProperties,

    heading: {
        color: colors.primary,
        fontSize: "22px",
        fontWeight: 700,
        margin: "0 0 16px",
    } satisfies CSSProperties,

    paragraph: {
        color: colors.text,
        fontSize: "15px",
        lineHeight: "24px",
        margin: "0 0 16px",
    } satisfies CSSProperties,

    buttonWrapper: {
        textAlign: "center",
        margin: "28px 0",
    } satisfies CSSProperties,

    button: {
        backgroundColor: colors.primary,
        borderRadius: "6px",
        color: "#FFFFFF",
        fontSize: "15px",
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-block",
        padding: "14px 32px",
        border: `1px solid ${colors.accentDark}`,
    } satisfies CSSProperties,

    noticeBox: {
        backgroundColor: "#FBF6EA",
        border: `1px solid ${colors.accent}`,
        borderRadius: "6px",
        padding: "14px 16px",
        margin: "0 0 24px",
    } satisfies CSSProperties,

    noticeText: {
        color: colors.secondary,
        fontSize: "14px",
        lineHeight: "20px",
        margin: 0,
    } satisfies CSSProperties,

    linkFallback: {
        color: colors.primary,
        fontSize: "13px",
        wordBreak: "break-all",
        margin: "0 0 8px",
    } satisfies CSSProperties,

    hr: {
        borderColor: colors.border,
        margin: "24px 0",
    } satisfies CSSProperties,

    footnote: {
        color: colors.muted,
        fontSize: "12px",
        lineHeight: "18px",
        margin: 0,
    } satisfies CSSProperties,

    footer: {
        color: colors.muted,
        fontSize: "12px",
        textAlign: "center",
        margin: "20px 0",
    } satisfies CSSProperties,
};