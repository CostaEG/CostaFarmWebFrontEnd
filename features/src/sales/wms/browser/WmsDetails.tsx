import { GridProps } from '@mui/material';
// import { useIsAuthorized } from '../../../core/hooks';
import { BooleanFieldOutput } from '../../../core/crud/browser/BooleanFieldOutput';
import { CollectionFieldOutput } from '../../../core/crud/browser/CollectionFieldOutput';
import CrudDetails from '../../../core/crud/browser/CrudDetails';
import { DateTimeFieldOutput } from '../../../core/crud/browser/DateTimeFieldOutput';
import { NumberFieldOutput } from '../../../core/crud/browser/NumberFieldOutput';
import { StringFieldOutput } from '../../../core/crud/browser/StringFieldOutput';
import { GridHS } from '../../../core/layout/browser/Grid';
// import SecurityScopes from '../../../core/security/SecurityScopes';
import {
  Wms,
  wmsTitle,
  wmsPath,
  wmsTierList,
} from '../wmsModels';
import { wmsService } from '../wmsService';

export default function WmsDetails({ ...gridProps }: GridProps) {
  // const authorized = useIsAuthorized([SecurityScopes.manageWms]);

  return (
    <CrudDetails<Wms>
      title={wmsTitle}
      path={wmsPath}
      detailsEndpoint={wmsService.endpoints.wmsById}
      // hideEditButton={!authorized}
      // archiveEndpoint={
      //   authorized ? wmsService.endpoints.archiveWms : undefined
      // }
      // recoverEndpoint={
      //   authorized ? wmsService.endpoints.recoverWms : undefined
      // }
      render={(model) => (
        <GridHS container padding={2} columnSpacing={2} rowSpacing={3}>
          <GridHS xs={12} md={6}>
            <StringFieldOutput label="Id" value={model.id.toString()} />
          </GridHS>
          <GridHS xs={12} md={6}>
            <StringFieldOutput label="Name" value={model.name} />
          </GridHS>
          <GridHS xs={12}>
            <StringFieldOutput
              label="Wms Tier"
              value={
                model.standardTier === undefined
                  ? '-'
                  : wmsTierList.values[model.standardTier]?.label || '-'
              }
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <StringFieldOutput
              label="Category"
              value={model.wmsCategory?.name}
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <CollectionFieldOutput
              label="Tags"
              value={model.tags?.map((x) => x.tag)}
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <NumberFieldOutput
              label="Default Discount"
              value={model.defaultDiscountPercentage}
              maximumFractionDigits={2}
              unit="%"
            />
          </GridHS>
          <GridHS xs={12}>
            <BooleanFieldOutput
              label="Overdue Account"
              value={model.overdueAccount}
            />
          </GridHS>
          <GridHS xs={12}>
            <StringFieldOutput label="Notes" value={model.notes} multiline />
          </GridHS>
          <GridHS xs={12}>
            <DateTimeFieldOutput
              label="Registered At"
              value={model.createdAt}
              variant="date"
            />
          </GridHS>
        </GridHS>
      )}
      {...gridProps}
    />
  );
}
