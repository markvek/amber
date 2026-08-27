import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { colors } from "@/edu-ui/tokens"

function Badge({
  className,
  variant = "default",
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "span"

  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return { backgroundColor: colors.primary, color: colors.textInverse }
      case "secondary":
        return { backgroundColor: colors.secondary, color: colors.textInverse }
      case "destructive":
        return { backgroundColor: colors.error, color: colors.textInverse }
      case "outline":
        return {
          borderColor: colors.neutral300,
          color: colors.textPrimary,
          borderWidth: '1px'
        }
      case "ghost":
        return { color: colors.textPrimary }
      case "link":
        return { color: colors.primary, textDecoration: 'underline' }
      default:
        return {}
    }
  }

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
        className
      )}
      style={{ ...getVariantStyles(), ...style }}
      {...props}
    />
  )
}

export { Badge }
