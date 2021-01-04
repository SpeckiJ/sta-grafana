// import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { getBackendSrv } from '@grafana/runtime';
import { StaQuery, DataSourceOptions } from './types';

export class DataSource extends DataSourceApi<StaQuery, DataSourceOptions> {
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url === undefined ? '' : instanceSettings.url;
  }

  /*
  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {
    //const { range } = options;
    //const from = range!.from.valueOf();
    //const to = range!.to.valueOf();

    //const data = options.targets.map(target => {

    //});

    // Return a constant for each query.

    console.log(options);
    const promises = options.targets.map(query => {
      this.doGET({
        url: "FeaturesOfInterest?$filter=name ne 'unknown'",
      }).then(response => {
        console.log(query.refId);

        const frame = new MutableDataFrame({
          fields: [
            { name: 'name', values: ['test'], type: FieldType.string },
            { name: 'latitude', values: [1], type: FieldType.number },
            { name: 'longitude', values: [1], type: FieldType.number },
            { name: 'metric', values: [1], type: FieldType.number },
          ],
        });
        return frame;

        (response.data as any).value.forEach((val: any) => {
          frame.appendRow(["asd", 52, 7, 3]);
        });

        return frame;
      });
    });
    return Promise.all(promises).then(data => ({ data }));

    //return { data };
  }

  //mapFOItoTable(): MutableDataFrame {

  //}

  */
  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {

    const frame = new MutableDataFrame({
      fields: [
        { name: 'name', type: FieldType.string },
        { name: 'latitude', type: FieldType.number },
        { name: 'longitude', type: FieldType.number },
        { name: 'metric', type: FieldType.number },
      ],
    });

    const promises = options.targets.map(query =>
      this.doGET({
        url: "FeaturesOfInterest?$filter=name ne 'unknown'",
      }).then(response => {
        console.log(response);
        response.value.forEach((point: any) => {
          frame.appendRow([point['@iot.id'], point.feature.coordinates[0], point.feature.coordinates[1], 1]);
        });

        return frame;
      })
    );

    return Promise.all(promises).then(data => ({ data }));
  }

  async testDatasource(): Promise<any> {
    // Implement a health check for your data source.
    return this.doGET({}).then(response => {
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

  async doGET(options: any) {
    options!.method = 'GET';
    options!.url = this.url + options!.url;
    return await getBackendSrv().request(options);
  }
}
