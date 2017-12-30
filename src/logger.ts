import { Console } from 'console';
import configManager from './config-manager';

const config = configManager('logging');
export const logger = new Console(process.stdout, process.stderr);
export function formatConsoleDate(date: Date) {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return '[' +
    ((hour < 10) ? '0' + hour : hour) +
    ':' +
    ((minutes < 10) ? '0' + minutes : minutes) +
    ':' +
    ((seconds < 10) ? '0' + seconds : seconds) +
    '.' +
    ('00' + milliseconds).slice(-3) +
    ']: ';
}

export default function (jobWorker?: any, io?: SocketIO.Server) {
  // jobWorker and socket.io instance are optional
  const loggerConfig = config.logger || {};
  // tslint:disable-next-line max-line-length
  const prefix = jobWorker ? `[dashboard: ${jobWorker.dashboard_name}] [job: ${jobWorker.job_name}] ` : '';

  loggerConfig.transport = (data: any) => {
    const logText = prefix + data.output;
    // tslint:disable-next-line no-console
    console.log(logText);
    if (io) {
      io.emit('server', { type: data.level, msg: logText });
    }
  };

  return logger;
}
