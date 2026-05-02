import * as cp from "child_process";
try {
  const log = cp.execSync('git log --oneline').toString();
  console.log("GIT LOG:");
  console.log(log);
} catch (e) {
  console.error(e);
}
