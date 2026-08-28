/**
 * Centralized server-side error logging utility.
 * Writes detailed technical error stack traces to `logs/errors.txt`
 * to keep sensitive database details and internals hidden from the user.
 */
export async function logError(context: string, error: unknown): Promise<void> {
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const { cwd } = await import("node:process");

    const logsDir = join(cwd(), "logs");
    await mkdir(logsDir, { recursive: true });

    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack ? error.stack : "No stack trace available";

    const logEntry = `
================================================================================
[${timestamp}] CONTEXT: ${context}
MESSAGE: ${errorMessage}
STACK:
${errorStack}
================================================================================
`;

    const logFilePath = join(logsDir, "errors.txt");
    await appendFile(logFilePath, logEntry, "utf8");
  } catch (loggingErr) {
    // Fallback console warning if disk write fails
    console.error("[Logger Failure]", loggingErr);
  }
}
