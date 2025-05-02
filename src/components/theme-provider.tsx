
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure the component only renders on the client side initially
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render nothing or a placeholder on the server/during hydration
    // This avoids hydration mismatches related to theme
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
