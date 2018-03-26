export interface IConfig {
  [key: string]: {
    interval: number;
    [key: string]: any;
  };
}

export interface IWidget {
  row: number;
  col: number;
  width: number;
  height: number;
  widget: string;
  job: string;
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
  config: IConfig;
}
