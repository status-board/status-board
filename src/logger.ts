import { Console } from 'console';
import * as SocketIO from 'socket.io';
import * as tracer from 'tracer';
import { configManager } from './config-manager';

const config = configManager('logging');

export const logger = new Console(process.stdout, process.stderr);

export default function (jobWorker?: any, io?: SocketIO.Server) {
  const loggerConfig = config.logger || {};
  const prefix = jobWorker ?
    (`[dashboard: ${jobWorker.dashboard_name}] [job: ${jobWorker.job_name}] `) : '';

  loggerConfig.transport = (data: any) => {
    const logText = prefix + data.output;
    logger.log(logText);
    if (io) {
      io.emit('server', { type: data.level, msg: logText });
    }
  };

  return tracer.colorConsole(loggerConfig);
}
