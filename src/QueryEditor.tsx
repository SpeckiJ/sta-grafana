import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { defaultQuery, DataSourceOptions, StaQuery, staEntity } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, StaQuery, DataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    if ((staEntity as any)[event.target.value] !== undefined) {
      console.log('registering new entity');
      query.entity = (staEntity as any)[event.target.value];
      // onChange({ ...query, entity: (staEntity as any)[event.target.value] });
    }
    onChange({ ...query, entityString: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { entityString } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={8}
          value={entityString || ''}
          onChange={this.onQueryTextChange}
          label="Query Text"
          tooltip="Not used yet"
        />
      </div>
    );
  }
}
