import { UnderscoreStatic } from 'underscore';

export type IJobCallback = (error: Error | null, data?: any) => void;

// TODO: Improve typings for dependencies
export interface IDependencies {
  underscore: UnderscoreStatic;
  storage: any;
  request: any;
  postgreSQL: any;
  moment: any;
  logger: any;
  hipchat: any;
  experimentalConfluence: any;
  easyRequest: any;
  async: any;
  app: any;
}

export interface IGlobalAuth {
  [key: string]: {
    [key: string]: any;
  };
}

export interface IConfig {
  interval: number;
  globalAuth: IGlobalAuth;

  [key: string]: any;
}

export interface IWidget {
  row: number;
  col: number;
  width: number;
  height: number;
  widget: string;
  job?: string;
  config: string;
}

export interface ILayout {
  customJS: string[];
  widgets: IWidget[];
}

export interface IDashboardConfig {
  title: string;
  titleVisible: boolean;
  description: string;
  layout: ILayout;
  config: {
    [key: string]: IConfig;
  };
}

export interface IFilters {
  jobFilter?: string | RegExp;
  dashboardFilter?: string | RegExp;
}

export interface IProcessedJob {
  config?: IConfig;
  configKey: string;
  dashboard_name: string;
  job_name: string;
  widget_item: IWidget;
  onRun: (config: IConfig, dependencies: IDependencies) => void;
  onInit: (config: IConfig, dependencies: IDependencies, jobCallback: IJobCallback) => void;
}
