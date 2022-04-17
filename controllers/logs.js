const log4js = require("log4js");

const logger = log4js.getLogger();

log4js.configure({
    appenders: {
        miLoggerConsole: { type: "console" },
        miLoggerFile: { type: "file", filename: "info.log" },
        miLoggerFile2: { type: "file", filename: "info2.log" },
    },
    categories: {
        default: { appenders: ["miLoggerConsole"], level: "trace" },
        consola: { appenders: ["miLoggerConsole"], level: "debug" },
        archivo: { appenders: ["miLoggerFile"], level: "warn" },
        archivo2: { appenders: ["miLoggerFile2"], level: "info" },
        todos: { appenders: ["miLoggerConsole", "miLoggerFile"], level: "error" },
    },
});

module.exports = { logger }