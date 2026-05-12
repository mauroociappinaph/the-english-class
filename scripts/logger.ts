/**
 * Logger Module: Blackbox for architectural observability.
 * Supports leveled logging, colors, and timestamps.
 */


enum LogLevelEnum {

  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const COLORS = {
  RESET: "\x1b[0m",
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
  GRAY: "\x1b[90m",
};

const LABELS = {
  [LogLevelEnum.DEBUG]: "DEBUG",
  [LogLevelEnum.INFO]: "INFO ",
  [LogLevelEnum.WARN]: "WARN ",
  [LogLevelEnum.ERROR]: "ERROR",
};


class Logger {

  private level: LogLevelEnum;

  constructor(level: LogLevelEnum = LogLevelEnum.INFO) {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    this.level = envLevel ? (LogLevelEnum[envLevel as keyof typeof LogLevelEnum] ?? level) : level;
    
    if (process.env.VERBOSE === 'true') {
      this.level = LogLevelEnum.DEBUG;
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace('T', ' ').split('.')[0];
  }

  private formatMessage(level: LogLevelEnum, message: string, context?: unknown): string {
    const timestamp = `${COLORS.GRAY}[${this.getTimestamp()}]${COLORS.RESET}`;
    let color = COLORS.RESET;
    
    switch (level) {
      case LogLevelEnum.DEBUG: color = COLORS.CYAN; break;
      case LogLevelEnum.INFO: color = COLORS.GREEN; break;
      case LogLevelEnum.WARN: color = COLORS.YELLOW; break;
      case LogLevelEnum.ERROR: color = COLORS.RED; break;
    }

    const label = `${color}${LABELS[level]}${COLORS.RESET}`;
    const ctx = context ? `\n${COLORS.GRAY}${JSON.stringify(context, null, 2)}${COLORS.RESET}` : '';
    
    return `${timestamp} ${label}: ${message}${ctx}`;
  }

  private log(level: LogLevelEnum, method: 'debug' | 'info' | 'warn' | 'error', message: string, context?: unknown): void {
    if (this.level <= level) {
      console[method](this.formatMessage(level, message, context));
    }
  }

  public debug(message: string, context?: unknown): void {
    this.log(LogLevelEnum.DEBUG, 'debug', message, context);
  }

  public info(message: string, context?: unknown): void {
    this.log(LogLevelEnum.INFO, 'info', message, context);
  }

  public warn(message: string, context?: unknown): void {
    this.log(LogLevelEnum.WARN, 'warn', message, context);
  }

  public error(message: string, context?: unknown): void {
    this.log(LogLevelEnum.ERROR, 'error', message, context);
  }

  /**
   * Set the log level dynamically
   */
  public setLevel(level: LogLevelEnum): void {
    this.level = level;
  }
}


// Export a singleton instance for global use
export const logger = new Logger();
