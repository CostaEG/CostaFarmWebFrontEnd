import { GridProps } from '@mui/material';
import WmsFilterForm from './WmsFilterForm';
// import { useIsAuthorized } from '../../../core/hooks';
import CrudList from '../../../core/crud/browser/CrudList';
// import SecurityScopes from '../../../core/security/SecurityScopes';
import { Wms, WmsFilter, wmsPath } from '../wmsModels';
import { wmsService } from '../wmsService';
import { selectWmsFilter, patchWmsFilter } from '../wmsSlice';

export default function WmsList({ ...gridProps }: GridProps) {
  // const authorized = useIsAuthorized([SecurityScopes.manageCustomers]);

  return (
    <CrudList<Wms, WmsFilter>
      path={wmsPath}
      listEndpoint={wmsService.endpoints.wms}
      listColumns={[
        { title: 'Id', getter: (x) => x.id.toString(), width: '25%' },
        { title: 'Name', getter: (x) => x.name },
      ]}
      selectFilter={selectWmsFilter}
      patchFilterActionCreator={patchWmsFilter}
      FilterFormComponent={WmsFilterForm}
      // hideAddButton={!authorized}
      {...gridProps}
    />
  );
}
