/* Import */
const colors = require("colors/safe");

/* Class and local vars */
let timeRun = 0;

class Logger {
  error(...data) {
    console.error(colors.red(colors.bold("⚠ Error:")), ...data, "🔴");
  }

  log(...data) {
    console.log(colors.green(colors.bold("# Log:")), ...data, "🟢");
  }

  success(...data) {
    console.log(colors.green(colors.bold("✔ Success:")), ...data, "🟢");
  }

  time_load_start() {
    timeRun = new Date().getTime();
  }

  time_load_end() {
    console.log(
      colors.yellow(colors.bold("⏳ TIME_LOAD:")),
      (new Date().getTime() - timeRun) / 1000 + " seconds",
      "🟢"
    );
  }

  app_request(...data) {
    console.log(colors.blue(colors.bold("➤ Request:")), ...data, "🟢");
  }

  warn(...data) {
    console.warn(colors.yellow(colors.bold("⚠ Warn:")), ...data, "🟡");
  }
}

/* Export */
module.exports = new Logger();
