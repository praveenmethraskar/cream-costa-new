// src/services/Logger.ts

/**
 * Interface for logging functionality.
 * Defines methods for different log levels (error, warn, info, debug).
 */
export interface Logger {
  /**
   * Logs an informational message.
   * @param {any} message - The message to log.
   * @param {any} optionalParams - Optional params, such as JSON
   */
  info(message: any, ...optionalParams: any[]): void

  /**
   * Logs an error message.
   * @param {string} message - The error message to log.
   * @param {any} optionalParams - Optional params, such as JSON
   */
  error(message: any, ...optionalParams: any[]): void

  /**
   * Logs a warning message.
   * @param {string} message - The warning message to log.
   * @param {any} optionalParams - Optional params, such as JSON
   */
  warn(message: any, ...optionalParams: any[]): void

  /**
   * Logs a debug message, but only in development environment.
   * @param {string} message - The debug message to log.
   * @param {any} optionalParams - Optional params, such as JSON
   */
  debug(message: any, ...optionalParams: any[]): void
}

/**
 * Implementation of the Logger interface.
 * This class provides methods to log messages at different log levels with color coding.
 */
export class AppLogger implements Logger {
  /**
   * Logs an error message with red color.
   * @param message - The message to log.
   */
  error(message: any, ...optionalParams: any[]): void {
    console.error(`%c${message}`, optionalParams, "color: red; font-weight: bold;")
  }

  /**
   * Logs a warning message with yellow color.
   * @param message - The message to log.
   */
  warn(message: any, ...optionalParams: any[]): void {
    console.warn(`%c${message}`, optionalParams, "color: yellow; font-weight: bold;")
  }

  /**
   * Logs an informational message with plain text color.
   * @param message - The message to log.
   */
  info(message: any, ...optionalParams: any[]): void {
    console.info(`%c${message}`, optionalParams, "color: black; font-weight: bold;")
  }

  /**
   * Logs a debug message with gray color.
   * This will be disabled in production builds.
   * @param message - The message to log.
   */
  debug(message: any, ...optionalParams: any[]): void {
    // Disable debug logs in production builds
    if (process.env.NODE_ENV === "production") return

    console.log(`%c${message}`, optionalParams, "color: gray; font-style: italic;")
  }
}
