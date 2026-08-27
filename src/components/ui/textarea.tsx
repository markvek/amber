import * as React from "react"
import { cn } from "@/lib/utils"
import { colors } from "@/edu-ui/tokens"

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border px-2.5 py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        borderColor: colors.neutral300,
        color: colors.textPrimary,
        backgroundColor: 'transparent',
      }}
      placeholder="..."
      {...props}
    />
  )
}

export { Textarea }
