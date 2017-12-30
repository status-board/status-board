import { create } from './hipchat';

export default function (jobWorker: any) {
  if (jobWorker.config.globalAuth.hipchat) {
    // TODO: hipchat initialization should happen just once
    return create({ api_key: jobWorker.config.globalAuth.hipchat.token });
  }
  return null;
}
