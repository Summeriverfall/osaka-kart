import { spawn } from "node:child_process";
import { rmSync } from "node:fs";

rmSync(".next", { recursive: true, force: true });

const env = { ...process.env };
delete env.GITHUB_PAGES;

const child = spawn("npx", ["next", "dev", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
