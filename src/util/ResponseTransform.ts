import { DatastreamFrame, FeatureOfInterestFrame, ObservationFrame, ObservedPropertyFrame, SensorFrame } from 'types';

// Transform STA FeatureOfInterest into frame
export function parseIntoFOIFrame(frame: FeatureOfInterestFrame, response: any) {
  response!.value!.forEach((element: any) => {
    frame.appendRow([
      element['@iot.id'],
      element['name'],
      element.feature.coordinates[0],
      element.feature.coordinates[1],
      1,
    ]);
  });
}

// Transform STA Observation into frame
export function parseIntoObservationFrame(frame: ObservationFrame, response: any) {
  response!.value!.forEach((element: any) => {
    frame.appendRow([element['@iot.id'], element['result'], element['phenomenonTime']]);
  });
}

// Transform STA Datastream into frame
export function parseIntoDatastreamFrame(frame: DatastreamFrame, response: any) {
  response!.value!.forEach((element: any) => {
    let phenTimes = element['phenomenonTime'].split('/');
    frame.appendRow([
      element['@iot.id'],
      element['phenomenonTime'],
      {
        area: element['observedArea'],
        toString(): string {
          return JSON.stringify(this.area, null, 4);
        },
      },
      Date.parse(phenTimes[0]),
      Date.parse(phenTimes[1]),
    ]);
  });
}

// Transform STA Sensor into frame
export function parseIntoSensorFrame(frame: SensorFrame, response: any) {
  console.log(response);
  frame.appendRow([
    response['@iot.id'],
    response['name'],
    response['description'],
    {
      raw: response,
      toString(): string {
        return JSON.stringify(this.raw, null, 4);
      },
    },
  ]);
}

// Transform STA ObservedProperty into frame
export function parseIntoObservedPropertyFrame(frame: ObservedPropertyFrame, response: any) {
  console.log(response);
  frame.appendRow([
    response['@iot.id'],
    response['name'],
    response['definition'],
    {
      raw: response,
      toString(): string {
        return JSON.stringify(this.raw, null, 4);
      },
    },
  ]);
}
