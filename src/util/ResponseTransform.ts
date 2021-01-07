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
  if (response!.value !== undefined) {
    response!.value!.forEach((element: any) => {
      parseDatastream(frame, element);
    });
  } else {
    parseDatastream(frame, response);
  }
}

function parseDatastream(frame: DatastreamFrame, element: any) {
  // We store phenomenonTimeStart/End to be used as template parameters for DataViewerDashboard
  var phenTimes: string[];
  var phenomenonTime: string;
  if (element['phenomenonTime'] === undefined) {
    phenTimes = ['0', '0'];
    phenomenonTime = '0';
  } else {
    phenTimes = element['phenomenonTime'].split('/');
    phenomenonTime = element['phenomenonTime'];
  }
  frame.appendRow([
    'Value Viewer',
    element['@iot.id'],
    phenomenonTime,
    element['observedArea'],
    Date.parse(phenTimes[0]),
    Date.parse(phenTimes[1]),
    element['unitOfMeasurement']['symbol'],
  ]);
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
