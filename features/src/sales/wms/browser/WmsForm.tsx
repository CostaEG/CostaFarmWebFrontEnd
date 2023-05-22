import { GridProps } from '@mui/material';
import { useMemo } from 'react';
import { BooleanFieldInput } from '../../../core/crud/browser/BooleanFieldInput';
import CrudForm from '../../../core/crud/browser/CrudForm';
import { EnumFieldInput } from '../../../core/crud/browser/EnumFieldInput';
import { NumberFieldInput } from '../../../core/crud/browser/NumberFieldInput';
import { SelectIdFieldInput } from '../../../core/crud/browser/SelectIdFieldInput';
import { SelectObjectFieldInput } from '../../../core/crud/browser/SelectObjectFieldInput';
import { StringFieldInput } from '../../../core/crud/browser/StringFieldInput';
import { GridHS } from '../../../core/layout/browser/Grid';
import {
  Wms,
  WmsCategory,
  WmsTag,
  wmsPath,
  wmsTitle,
  wmsTierList,
} from '../wmsModels';
import {
  useWmsCategoriesQuery,
  useWmsTagsQuery,
  wmsService,
  checkWmsName,
} from '../wmsService';
import { getPropertyName } from '../../../core/form/initialValues';
import { useAppDispatch } from '../../../core/hooks';

export default function WmsForm({ ...gridProps }: GridProps) {
  const dispatch = useAppDispatch();
  const { isFetching: isFetchingCategories, data: categories } =
    useWmsCategoriesQuery();
  const { isFetching: isFetchingTags, data: tags } = useWmsTagsQuery();

  const defaultValues = useMemo<Partial<Wms>>(
    () => ({
      id: 0,
      rowVersion: undefined,
      name: '',
      standardTier: undefined,
      categoryId: undefined,
      overdueAccount: false,
      defaultDiscountPercentage: 0,
      createdAt: undefined,
      notes: '',
      tags: [],
    }),
    []
  );

  return (
    <CrudForm<Wms>
      title={wmsTitle}
      path={wmsPath}
      defaultValues={defaultValues}
      detailsEndpoint={wmsService.endpoints.wmsById}
      addOrUpdateEndpoint={wmsService.endpoints.addOrUpdateWms}
      render={(submitting) => (
        <GridHS container padding={2} columnSpacing={2}>
          <GridHS xs={12} md={6}>
            <StringFieldInput
              label="Name"
              fieldName={getPropertyName<Wms>((x) => x.name)}
              require
              disabled={submitting}
              validateAsync={async (value, allValues: Wms) => {
                try {
                  await dispatch(
                    checkWmsName({ name: value, id: allValues.id })
                  );

                  return undefined;
                } catch {
                  return 'Duplicated';
                }
              }}
            />
          </GridHS>
          <GridHS xs={12}>
            <EnumFieldInput
              label="Wms Tier"
              fieldName={getPropertyName<Wms>((x) => x.standardTier)}
              require
              disabled={submitting}
              options={wmsTierList.list}
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <SelectIdFieldInput<WmsCategory>
              label="Category"
              fieldName={getPropertyName<Wms>((x) => x.categoryId)}
              isFetching={isFetchingCategories}
              options={categories}
              getOptionValue={(x) => x.id}
              getOptionLabel={(x) => x.name}
              require
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <SelectObjectFieldInput<WmsTag>
              label="Tags"
              fieldName={getPropertyName<Wms>((x) => x.tags)}
              isFetching={isFetchingTags}
              multiple={true}
              options={tags}
              getOptionValue={(x) => x.id}
              getOptionLabel={(x) => x.tag}
              require
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12} md={6}>
            <NumberFieldInput
              label="Default Discount"
              fieldName={getPropertyName<Wms>(
                (x) => x.defaultDiscountPercentage
              )}
              min={0}
              max={100}
              unit="%"
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12}>
            <BooleanFieldInput
              label="Overdue Account"
              fieldName={getPropertyName<Wms>((x) => x.overdueAccount)}
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12}>
            <StringFieldInput
              label="Notes"
              fieldName={getPropertyName<Wms>((x) => x.notes)}
              multiline
              rows={3}
              disabled={submitting}
            />
          </GridHS>
        </GridHS>
      )}
      {...gridProps}
    />
  );
}
