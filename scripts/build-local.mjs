import { spawn } from "node:child_process";

const env = { ...process.env };
delete env.GITHUB_PAGES;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true, env });
    child.on("exit", (code) => {
      if (code) reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
      else resolve();
    });
  });
}

await run("npx", ["next", "build"]);
await run("node", ["scripts/file-openable.mjs"]);
