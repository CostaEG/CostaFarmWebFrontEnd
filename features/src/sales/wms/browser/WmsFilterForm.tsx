import { GridProps } from '@mui/material';
import { useMemo } from 'react';
import CrudFilterForm from '../../../core/crud/browser/CrudFilterForm';
import { SelectIdFieldInput } from '../../../core/crud/browser/SelectIdFieldInput';
import { StringFieldInput } from '../../../core/crud/browser/StringFieldInput';
import { GridHS } from '../../../core/layout/browser/Grid';
import {
  WmsFilter,
  WmsCategory,
  WmsTag,
} from '../wmsModels';
import {
  useWmsCategoriesQuery,
  useWmsTagsQuery,
} from '../wmsService';
import { selectWmsFilter, patchWmsFilter } from '../wmsSlice';
import { getPropertyName } from '../../../core/form/initialValues';
import { SelectBooleanFieldInput } from '../../../core/crud/browser/SelectBooleanFieldInput';

interface WmsFilterFormProps extends GridProps {
  onClose: () => void;
}

export default function WmsFilterForm({
  onClose,
  ...gridProps
}: WmsFilterFormProps) {
  const { isFetching: isFetchingCategories, data: categories } =
    useWmsCategoriesQuery();
  const { isFetching: isFetchingTags, data: tags } = useWmsTagsQuery();

  const defaultValues = useMemo<Partial<WmsFilter>>(
    () => ({
      search: '',
      categoryIds: undefined,
      tagIds: undefined,
      archived: undefined,
    }),
    []
  );

  return (
    <CrudFilterForm<WmsFilter>
      defaultValues={defaultValues}
      selectFilter={selectWmsFilter}
      patchFilterActionCreator={patchWmsFilter}
      render={(submitting) => (
        <GridHS container padding={2} columnSpacing={2}>
          <GridHS xs={12}>
            <StringFieldInput
              label="Search"
              fieldName={getPropertyName<WmsFilter>((x) => x.search)}
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12}>
            <SelectIdFieldInput<WmsCategory>
              label="Categories"
              fieldName={getPropertyName<WmsFilter>((x) => x.categoryIds)}
              multiple={true}
              isFetching={isFetchingCategories}
              options={categories}
              getOptionValue={(x) => x.id}
              getOptionLabel={(x) => x.name}
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12}>
            <SelectIdFieldInput<WmsTag>
              label="Tags"
              fieldName={getPropertyName<WmsFilter>((x) => x.tagIds)}
              multiple={true}
              isFetching={isFetchingTags}
              options={tags}
              getOptionValue={(x) => x.id}
              getOptionLabel={(x) => x.tag}
              disabled={submitting}
            />
          </GridHS>
          <GridHS xs={12}>
            <SelectBooleanFieldInput
              label="Archived"
              fieldName={getPropertyName<WmsFilter>((x) => x.archived)}
              disabled={submitting}
            />
          </GridHS>
        </GridHS>
      )}
      onClose={onClose}
      {...gridProps}
    />
  );
}
