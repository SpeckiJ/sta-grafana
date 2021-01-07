import { DataQuery, DataSourceJsonData, FieldType, MutableDataFrame } from '@grafana/data';

export enum staEntity {
  'Thing',
  'Datastream',
  'FeatureOfInterest',
  'Sensor',
  'Platform',
  'ObservedProperty',
  'Observation',
}

export interface StaQuery extends DataQuery {
  entity: staEntity;
  entityString: string;
}

export const defaultQuery: Partial<StaQuery> = {};

export interface MyVariableQuery {}

/**
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {}

export const emptyFrame = new MutableDataFrame({
  fields: [],
});

export interface DatastreamFrame extends MutableDataFrame {}
export function datastreamFrame(): DatastreamFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'DataViewerLink', type: FieldType.string },
      { name: 'id', type: FieldType.string },
      { name: 'phenomenonTime', type: FieldType.string },
      { name: 'geometry', type: FieldType.other },
      { name: 'minPhenomenonTime', type: FieldType.number },
      { name: 'maxPhenomenonTime', type: FieldType.number },
      { name: 'unit', type: FieldType.string },
    ],
  });
}

export interface ThingFrame extends MutableDataFrame {}
export function thingFrame(): ThingFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
    ],
  });
}

export interface SensorFrame extends MutableDataFrame {}
export function sensorFrame(): SensorFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'description', type: FieldType.string },
      { name: 'raw', type: FieldType.other },
    ],
  });
}

export interface ObservedPropertyFrame extends MutableDataFrame {}
export function observedPropertyFrame(): ObservedPropertyFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'definition', type: FieldType.string },
      { name: 'raw', type: FieldType.other },
    ],
  });
}

export interface ObservationFrame extends MutableDataFrame {}
export function observationFrame(unit: string): ObservationFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'value', type: FieldType.number, config: { unit: unit } },
      { name: 'time', type: FieldType.time },
    ],
  });
}

export interface FeatureOfInterestFrame extends MutableDataFrame {}
export function foiFrame(): FeatureOfInterestFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'latitude', type: FieldType.number },
      { name: 'longitude', type: FieldType.number },
    ],
  });
}
