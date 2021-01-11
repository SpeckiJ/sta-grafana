import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { getTemplateSrv } from '@grafana/runtime';
import { STAService } from 'util/STAService';
import { StaQuery, DataSourceOptions, RequestFunctions, emptyFrame } from './types';

export class DataSource extends DataSourceApi<StaQuery, DataSourceOptions> {
  staService: STAService;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    let url = instanceSettings.url === undefined ? '' : instanceSettings.url;
    this.staService = new STAService(url);
  }

  // Observations?$top=500&$select=result,phenomenonTime&$filter=Datastream/Sensor/id eq 'urn:ogc:object:feature:Sensor:UFZ:737' and properties/projectId eq '41' and (phenomenonTime ge ${__from:date:iso} and phenomenonTime le ${__to:date:iso})

  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {
    const from_date = getTemplateSrv().replace('${__from:date:iso}', options.scopedVars);
    const to_date = getTemplateSrv().replace('${__to:date:iso}', options.scopedVars);

    const promises = options.targets.map(query => {
      let arg1 = getTemplateSrv().replace(query.requestArgs[0]);
      // Start multiplexing here
      switch (query.requestFunction!) {
        case RequestFunctions.getObservationsByDatastreamId: {
          console.log('getObservationsByDatastreamId');
          // Get original Datastream first to get UoM
          return this.staService.getDatastream(arg1).then(result => {
            return this.staService.getObservationsByDatastreamId(arg1, from_date, to_date, result.get(0)['unit']);
          });
        }

        case RequestFunctions.getObservationsByCustom: {
          console.log('getObservationsByCustom');
          // Get original Datastream first to get UoM
          return this.staService.getObservationsByCustom(arg1);
          //return this.staService.getDatastream(arg1).then(result => {
          //  return this.staService.getObservationsByDatastreamId(arg1, from_date, to_date, result.get(0)['unit']);
          //});
        }
        //case staEntity.FeatureOfInterest: {
        //  console.log('FOI');
        //  return this.staService.getPaginated(this.url + 'FeaturesOfInterest', foiFrame(), this.parseIntoFOIFrame);
        //}
        case RequestFunctions.getDatastream: {
          console.log('getDatastreams');
          return this.staService.getDatastreams();
        }
        case RequestFunctions.getSensorByDatastreamId: {
          console.log('getSensorByDatastreamId');
          return this.staService.getSensorByDatastreamId(arg1);
        }
        case RequestFunctions.getObservedPropertyByDatastreamId: {
          console.log('getObservedPropertyByDatastreamId');
          return this.staService.getObservedPropertyByDatastreamId(arg1);
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
