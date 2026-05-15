import Button from "@mui/material/Button"

import type { ReactNode } from "react"
import { forwardRef } from "react"

import { playTapSound } from "../sounds"

type AlternativeButtonProps = {
  children: ReactNode
  selected: boolean
  disabled?: boolean
  onClick?: () => void | Promise<void>
  choiceBg: string
  choiceBorder: string
  choiceText: string
  choiceSelectedBg: string
  choiceSelectedBorder: string
  choiceSelectedText: string
  accentBlue: string
  tabIndex?: number
}

const AlternativeButton = forwardRef<HTMLButtonElement, AlternativeButtonProps>(
  function AlternativeButton(
    {
      children,
      selected,
      disabled = false,
      onClick,
      choiceBg,
      choiceBorder,
      choiceText,
      choiceSelectedBg,
      choiceSelectedBorder,
      choiceSelectedText,
      accentBlue,
    },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        role="radio"
        aria-checked={selected}
        disableRipple
        disableFocusRipple
        fullWidth
        disabled={disabled}
        onClick={() => {
          if (disabled) return

          playTapSound()
          void onClick?.()
        }}
        sx={{
          height: "64px",
          fontSize: "1.5rem",
          borderRadius: "16px",
          textTransform: "none",
          boxShadow: "none",
          backgroundColor: selected ? choiceSelectedBg : choiceBg,
          color: selected ? choiceSelectedText : choiceText,
          border: `2px solid ${selected ? choiceSelectedBorder : choiceBorder}`,
          "&:hover": {
            backgroundColor: selected ? choiceSelectedBg : choiceBg,
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: `4px solid ${accentBlue}`,
            outlineOffset: "2px",
          },
        }}
      >
        {children}
      </Button>
    )
  },
)

export default AlternativeButton