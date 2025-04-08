// src/lib/log.ts
import * as chalkRaw from 'chalk';
const chalk = chalkRaw.default;

export const log = {
  title: (msg: string) => console.log(chalk.bold.cyan(msg)),
  success: (msg: string) => console.log(chalk.green(`✔ ${msg}`)),
  fail: (msg: string) => console.error(chalk.red(`❌ ${msg}`)),
  info: (msg: string) => console.log(chalk.gray(msg)),
};
