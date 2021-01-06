import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { getTemplateSrv } from '@grafana/runtime';
import { STAService } from 'util/STAService';
import { StaQuery, DataSourceOptions, staEntity, emptyFrame } from './types';

export class DataSource extends DataSourceApi<StaQuery, DataSourceOptions> {
  staService: STAService;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    let url = instanceSettings.url === undefined ? '' : instanceSettings.url;
    this.staService = new STAService(url);
  }

  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {
    const from_date = getTemplateSrv().replace('${__from:date:iso}', options.scopedVars);
    const to_date = getTemplateSrv().replace('${__to:date:iso}', options.scopedVars);
    const dsId = getTemplateSrv().replace('${datastreamId}', options.scopedVars);

    const promises = options.targets.map(query => {
      // Start multiplexing here
      switch (query.entity!) {
        case staEntity.Observation: {
          console.log('getObservationsByDatastreamId');
          return this.staService.getObservationsByDatastreamId(dsId, from_date, to_date);
        }
        //case staEntity.FeatureOfInterest: {
        //  console.log('FOI');
        //  return this.staService.getPaginated(this.url + 'FeaturesOfInterest', foiFrame(), this.parseIntoFOIFrame);
        //}
        case staEntity.Datastream: {
          console.log('getDatastreams');
          return this.staService.getDatastreams();
        }
        case staEntity.Sensor: {
          console.log('getSensorByDatastreamId');
          return this.staService.getSensorByDatastreamId(dsId);
        }
        case staEntity.ObservedProperty: {
          console.log('getObservedPropertyByDatastreamId');
          return this.staService.getObservedPropertyByDatastreamId(dsId);
        }
        default: {
          console.log('Default empty');
          return new Promise<MutableDataFrame>(resolve => {
            resolve(emptyFrame);
          });
        }
      }
    });

    return Promise.all(promises).then(data => ({ data }));
  }

  /*
  async metricFindQuery(query: MyVariableQuery, options?: any) {
    // Retrieve DataQueryResponse based on query.
    // const response = await this.doGET("Things");

    // Convert query results to a MetricFindValue[]
    // const values = response..map(frame => ({ text: frame.name }));
    console.log('im here!!');
    return [{ text: 'asdf' }, { text: 'wasd' }];
  }
  */

  async testDatasource(): Promise<any> {
    // Implement a health check for your data source.
    return this.staService.doGET({}).then(response => {
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Successfully checked connection to STA',
          title: 'Success',
        };
      }
      return {
        status: 'error',
        message: `Error while checking datasource. Got HTTP Status: ${response.status}`,
        title: 'Error',
      };
    });
  }
}
