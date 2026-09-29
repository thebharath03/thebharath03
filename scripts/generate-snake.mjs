import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { generateSnakeAnimation } from "generate-snake-animation";

const username = process.env.GITHUB_USERNAME || "thebharath03";

const getGithubToken = () => {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  const result = spawnSync("gh", ["auth", "token"], { encoding: "utf8" });
  if (result.status === 0) {
    return result.stdout.trim();
  }

  return undefined;
};

const outputs = [
  {
    format: "svg",
    drawOptions: {
      backgroundColor: "#0D1B2A",
      snakeColor: "#C9B99B",
      lineColor: "#1B2A41",
    },
  },
];

const githubToken = getGithubToken();

const results = await generateSnakeAnimation(
  {
    platform: "github",
    username,
    ...(githubToken ? { githubToken } : {}),
  },
  outputs,
);

await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/github-contribution-grid-snake-dark.svg", results[0]);
