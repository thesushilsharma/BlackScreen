"use server";

import { spawn } from "child_process";
import os from "os";

export async function executeTerminalCommand(command: string) {
  console.log("Server action: Executing command:", command);
  
  return new Promise<{
    success: boolean;
    output: string;
    exitCode: number;
  }>((resolve) => {
    const childProcess = spawn(command, [], {
      shell: true,
      cwd: process.env.PWD || os.homedir(),
      env: process.env,
    });

    let output = "";
    let error = "";

    childProcess.stdout.on("data", (data) => {
      console.log("Server action: stdout data:", data.toString());
      output += data.toString();
    });

    childProcess.stderr.on("data", (data) => {
      console.log("Server action: stderr data:", data.toString());
      error += data.toString();
    });

    childProcess.on("close", (code) => {
      console.log("Server action: Process closed with code:", code);
      console.log("Server action: Final output:", output || error);
      resolve({
        success: code === 0,
        output: output || error,
        exitCode: code || 0,
      });
    });
  });
}

export async function createTerminalSession() {
  const sessionId = Math.random().toString(36).substring(7);
  const shell = process.platform === "win32" ? "pwsh.exe" : "bash";

  return {
    success: true,
    sessionId,
    message: "Terminal created successfully",
    initialOutput: `Terminal ready. Shell: ${shell}\nCWD: ${
      process.env.PWD || os.homedir()
    }\n$ `,
  };
}
