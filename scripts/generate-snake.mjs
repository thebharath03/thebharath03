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
      colorDots: ["#161b22", "#01311f", "#034525", "#0f6d31", "#00c647"],
      colorEmpty: "#161b22",
      colorDotBorder: "#1b1f230a",
      colorSnake: "#C9B99B",
      sizeCell: 16,
      sizeDot: 12,
      sizeDotBorderRadius: 2,
    },
    animationOptions: {
      stepDurationMs: 100,
      frameByStep: 1,
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
