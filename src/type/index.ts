import { Express } from 'express-serve-static-core';
import { Server } from 'socket.io';
import { UnderscoreStatic } from 'underscore';

export type IVoidCallbackWithData = (error: Error | null, data?: any) => void;
export type IVoidCallbackWithError = (error?: Error) => void;

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
  enabled?: boolean;
  r?: number;
  row?: number;
  c?: number;
  col?: number;
  w?: number;
  width?: number;
  h?: number;
  height?: number;
  widget: string;
  job?: string;
  config: string | string[];
}

export interface IGridSize {
  columns: number;
  rows: number;
}

export interface ILayout {
  gridSize: IGridSize;
  customJS: string[];
  widgets: IWidget[];
}

export interface IDashboardConfig {
  enabled?: boolean;
  title?: string;
  titleVisible?: boolean;
  description?: string;
  layout: ILayout;
  config?: {
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
  onRun: (
    config: IConfig,
    dependencies: IDependencies,
  ) => void;
  onInit: (
    config: IConfig,
    dependencies: IDependencies,
    jobCallback: IVoidCallbackWithData,
  ) => void;
}

export interface IJobOptions {
  configPath: string;
  deps: {
    app: Express;
    io: Server;
  };
  filters?: IFilters;
  packagesPath: string[];
}

export interface IOptions {
  port: number;
  install?: boolean;
  filters?: IFilters;
}

export type IOnInit = (
  config: IConfig,
  dependencies: IDependencies,
) => void;

export type IOnRun = (
  config: IConfig,
  dependencies: IDependencies,
  jobCallback: IVoidCallbackWithData,
) => void;

export interface IJob {
  configKey: string;
  dashboard_name: string;
  job_name: string;
  widget_item: IWidget;
  onRun: IOnRun;
  onInit: IOnInit;
  config: IConfig;
}
