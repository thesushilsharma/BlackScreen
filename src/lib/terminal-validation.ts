import { z } from 'zod';

export const terminalConfigSchema = z.object({
  cols: z.number().min(20).max(200).default(80),
  rows: z.number().min(10).max(100).default(24),
  shell: z.string().optional(),
  theme: z.enum(['dark', 'light', 'matrix', 'ocean']).default('dark')
});

export const terminalInputSchema = z.object({
  data: z.string().min(0).max(10000)
});

export const terminalResizeSchema = z.object({
  cols: z.number().min(20).max(200),
  rows: z.number().min(10).max(100)
});

export type TerminalConfig = z.infer<typeof terminalConfigSchema>;
export type TerminalInput = z.infer<typeof terminalInputSchema>;
export type TerminalResize = z.infer<typeof terminalResizeSchema>;