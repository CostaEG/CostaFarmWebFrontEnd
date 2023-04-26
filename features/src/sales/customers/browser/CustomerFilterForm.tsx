import { GridProps } from "@mui/material";
import { useMemo } from "react";
import CrudFilterForm from "../../../core/crud/browser/CrudFilterForm";
import { SelectIdFieldInput } from "../../../core/crud/browser/SelectIdFieldInput";
import { StringFieldInput } from "../../../core/crud/browser/StringFieldInput";
import { GridHS } from "../../../core/layout/browser/Grid";
import { CustomerFilter, CustomerCategory, CustomerTag } from "../customerModels";
import { useCustomerCategoriesQuery, useCustomerTagsQuery } from "../customerService";
import { selectCustomerFilter, patchCustomerFilter } from "../customerSlice";
import { getPropertyName } from "../../../core/form/initialValues";
import { SelectBooleanFieldInput } from "../../../core/crud/browser/SelectBooleanFieldInput";

interface CustomerFilterFormProps extends GridProps {
    onClose: () => void
}

export default function CustomerFilterForm({ onClose, ...gridProps }: CustomerFilterFormProps) {

    const { isFetching: isFetchingCategories, data: categories } = useCustomerCategoriesQuery();
    const { isFetching: isFetchingTags, data: tags } = useCustomerTagsQuery();

    const defaultValues = useMemo<Partial<CustomerFilter>>(() => ({
        search: '',
        categoryIds: undefined,
        tagIds: undefined,
        archived: undefined
    }), []);

    return (
        <CrudFilterForm<CustomerFilter>
            defaultValues={defaultValues}
            selectFilter={selectCustomerFilter}
            patchFilterActionCreator={patchCustomerFilter}
            render={submitting => (
                <GridHS container padding={2} columnSpacing={2}>
                    <GridHS xs={12}>
                        <StringFieldInput label="Search" fieldName={getPropertyName<CustomerFilter>(x => x.search)} disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12}>
                        <SelectIdFieldInput<CustomerCategory>
                            label="Categories"
                            fieldName={getPropertyName<CustomerFilter>(x => x.categoryIds)}
                            multiple={true}
                            isFetching={isFetchingCategories}
                            options={categories}
                            getOptionValue={x => x.id}
                            getOptionLabel={x => x.name}
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12}>
                        <SelectIdFieldInput<CustomerTag>
                            label="Tags"
                            fieldName={getPropertyName<CustomerFilter>(x => x.tagIds)}
                            multiple={true}
                            isFetching={isFetchingTags}
                            options={tags}
                            getOptionValue={x => x.id}
                            getOptionLabel={x => x.tag}
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12}>
                        <SelectBooleanFieldInput
                            label="Archived"
                            fieldName={getPropertyName<CustomerFilter>(x => x.archived)}
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
