import { Console } from 'console';
import configManager from './config-manager';

const config = configManager('logging');

export default function (jobWorker?: any, io?: any) {
  // jobWorker and socket.io instance are optional

  // const loggerConfig = config.logger || {};
  //
  // const prefix = jobWorker ? ('[dashboard: ' + jobWorker.dashboard_name + '] [job: ' + jobWorker.job_name + '] ') : '';
  //
  // loggerConfig.transport = (data: any) => {
  //   const logText = prefix + data.output;
  //   console.log(logText);
  //   if (io) {
  //     io.emit('server', { type: data.level, msg: logText });
  //   }
  // };

  return new Console(process.stdout, process.stderr);
}
