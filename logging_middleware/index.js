const axios = require("axios");

// ── Log function — POST to test server ────────────────────────────────────
async function Log(stack, level, package_name, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack:   stack,
        level:   level,
        package: package_name,
        message: message
      }
    );
    console.log("Log created:", response.data);
  } catch (error) {
    console.error("Log failed:", error.message);
  }
}

// ── requestLogger middleware — Express ke liye ────────────────────────────
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end.bind(res);

  res.end = (...args) => {
    const duration = Date.now() - start;
    const status   = res.statusCode;

    const colour =
      status >= 500 ? "\x1b[31m" :
      status >= 400 ? "\x1b[33m" :
      status >= 300 ? "\x1b[36m" : "\x1b[32m";
    const reset = "\x1b[0m";

    console.log(`[${new Date().toISOString()}] ${colour}${status}${reset} ${req.method} ${req.originalUrl} — ${duration}ms`);

    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    Log("backend", level, "route", `${req.method} ${req.originalUrl} ${status} ${duration}ms`);

    originalEnd(...args);
  };

  next();
};

module.exports = { Log, requestLogger };