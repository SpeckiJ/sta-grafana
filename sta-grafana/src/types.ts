import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface StaQuery extends DataQuery {}

export const defaultQuery: Partial<StaQuery> = {};

/**
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {}
