import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import type { ReactNode } from "react"

type ActionButtonProps = {
  children: ReactNode
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export default function ActionButton({
  children,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const successBg = "#58cc02"
  const successShadow = "#46a302"
  const successText = isDark ? "#163300" : "#ffffff"
  const disabledBg = isDark ? "#31414d" : "#e5e7eb"
  const disabledText = isDark ? "#7f8c97" : "#9ca3af"

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        minWidth: "180px",
        minHeight: "56px",
        padding: "14px 28px",
        border: "none",
        borderRadius: "16px",
        backgroundColor: disabled ? disabledBg : successBg,
        color: disabled ? disabledText : successText,
        fontSize: "22px",
        fontWeight: 800,
        textTransform: "uppercase",
        boxShadow: disabled ? "none" : `0 4px 0 ${successShadow}`,
        transition: "transform 0.08s ease, box-shadow 0.08s ease",
        "&:hover": disabled
          ? {}
          : {
              backgroundColor: successBg,
              boxShadow: `0 5px 0 ${successShadow}`,
              transform: "translateY(-1px)",
            },
        "&:active": disabled
          ? {}
          : {
              backgroundColor: successBg,
              boxShadow: `0 2px 0 ${successShadow}`,
              transform: "translateY(2px)",
            },
      }}
    >
      {children}
    </Button>
  )
}