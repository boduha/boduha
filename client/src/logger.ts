const isDev = import.meta.env.DEV

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log("[BODUHA][CLIENT]", ...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info("[BODUHA][CLIENT]", ...args)
  },
  error: (...args: unknown[]) => {
    console.error("[BODUHA][CLIENT]", ...args)
  },
}