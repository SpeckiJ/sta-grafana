import { MutableDataFrame } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

import { datastreamFrame, observationFrame, observedPropertyFrame, sensorFrame } from 'types';
import {
  parseIntoDatastreamFrame,
  parseIntoObservationFrame,
  parseIntoObservedPropertyFrame,
  parseIntoSensorFrame,
} from './ResponseTransform';

export class STAService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getDatastreams(): Promise<MutableDataFrame> {
    return this.getPaginated(this.url + 'Datastreams', datastreamFrame(), parseIntoDatastreamFrame);
  }

  async getDatastream(id: string): Promise<MutableDataFrame> {
    return this.getPaginated(this.url + "Datastreams('" + id + "')", datastreamFrame(), parseIntoDatastreamFrame);
  }

  async getSensorByDatastreamId(datastreamId: string): Promise<MutableDataFrame> {
    return this.getPaginated(
      this.url + "Datastreams('" + datastreamId + "')/Sensor",
      sensorFrame(),
      parseIntoSensorFrame
    );
  }

  async getObservedPropertyByDatastreamId(datastreamId: string): Promise<MutableDataFrame> {
    return this.getPaginated(
      this.url + "Datastreams('" + datastreamId + "')/ObservedProperty",
      observedPropertyFrame(),
      parseIntoObservedPropertyFrame
    );
  }

  async getObservationsByDatastreamId(
    datastreamId: string,
    from_date: string,
    to_date: string,
    unit: string
  ): Promise<MutableDataFrame> {
    return this.getPaginated(
      this.url +
        "Datastreams('" +
        datastreamId +
        "')/Observations?" +
        '$filter=phenomenonTime ge ' +
        from_date +
        ' and phenomenonTime le ' +
        to_date +
        '&$top=10000' +
        '&$orderby=phenomenonTime asc',
      observationFrame(unit),
      parseIntoObservationFrame
    );
  }

  async getPaginated(url: string, frame: MutableDataFrame, responseParser: Function): Promise<MutableDataFrame> {
    return this.doGET({
      url: url,
    }).then(response => {
      // Parse values from this page into frame
      responseParser(frame, response);
      // Check if there are additional pages
      if ('@iot.nextLink' in response) {
        // Request next page recursively
        return this.getPaginated(response['@iot.nextLink'], frame, responseParser);
      } else {
        return frame;
      }
    });
  }

  async doGET(options: any) {
    options!.method = 'GET';
    if (!('url' in options)) {
      options.url = this.url;
    }
    return await getBackendSrv().request(options);
  }
}
