declare module 'tracer' {
  export = Tracer;

  namespace Tracer {
    export function console(options?: LoggerOptions): Logger;

    export function colorConsole(options?: LoggerOptions): Logger;

    export interface LoggerOptions {
      /**
       * Output level, e.g. "warn", "error", etc.
       */
      level?: string | number;

      /**
       * Output format. E.g. {{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})
       */
      format?: string;

      /**
       * Date format. E.g. HH:MM:ss.L
       */
      dateFormat?: string;

      /**
       * Function that pre-processes log data before printing.
       */
      preprocess?: (data: LogItem) => void;

      /**
       * Customize output methods (default: log, trace, debug, info, warn, error)
       */
      methods?: string[];

      /**
       * List of filters (e.g. for use with colors) to apply
       */
      filters?: Filters | Filter[];

      /**
       * Specify a method for log disposition (default is writing to the console)
       */
      transport?: (data: LogItem) => void;

      /**
       * Options for printing object types
       */
      inspectOpt?: InspectOptions;

      /**
       * Specify the stack index for file info
       */
      stackIndex?: number;
    }

    /**
     * Represents one log item/message
     */
    export interface LogItem {
      /**
       * Time of the log item
       */
      timestamp: string;

      /**
       * Message string
       */
      message: string;

      /**
       * Log title
       */
      title: string;

      /**
       * Log level
       */
      level: string | number;

      /**
       * Args for log message replacements (%s, %d, etc.)
       */
      args: any;
    }

    /**
     * Options for printing object types
     */
    export interface InspectOptions {
      /**
       * The objects non-enumerable properties will be shown too
       */
      showHidden: boolean;

      /**
       * How many times to recurse while formatting an object
       */
      depth: number;
    }

    export interface Filters {
      [key: string]: Filter;
    }

    export interface Filter {
      (input: string): string;

      [key: string]: ((input: string) => string) | Array<(input: string) => string>;
    }

    export interface Logger {
      log: (...args: any[]) => void;
      trace: (...args: any[]) => void;
      debug: (...args: any[]) => void;
      info: (...args: any[]) => void;
      warn: (...args: any[]) => void;
      error: (...args: any[]) => void;

      /**
       * Method names may be customized, but there's no way to model this in TypeScript
       * without using `any`. Caller must use ["bracketNotation"] instead.
       */
      [methodName: string]: (...args: any[]) => void;
    }
  }
}
