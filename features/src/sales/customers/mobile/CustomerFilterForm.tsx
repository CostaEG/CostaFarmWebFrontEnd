import { useMemo } from "react";
import CrudFilterForm from "../../../core/crud/mobile/CrudFilterForm";
import { SelectIdFieldInput } from "../../../core/crud/mobile/SelectIdFieldInput";
import { StringFieldInput } from "../../../core/crud/mobile/StringFieldInput";
import { CustomerFilter, CustomerCategory, CustomerTag, customerTitle, customersPath } from "../customerModels";
import { useCustomerCategoriesQuery, useCustomerTagsQuery } from "../customerService";
import { selectCustomerFilter, patchCustomerFilter } from "../customerSlice";
import { SelectBooleanFieldInput } from "../../../core/crud/mobile/SelectBooleanFieldInput";

export default function CustomerFilterForm() {

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
            title={customerTitle}
            path={customersPath}
            defaultValues={defaultValues}
            selectFilter={selectCustomerFilter}
            patchFilterActionCreator={patchCustomerFilter}
            render={submitting => (
                <>
                    <StringFieldInput label="Search" fieldName="search" disabled={submitting} fullWidth/>
                    <SelectIdFieldInput<CustomerCategory>
                        label="Categories"
                        fieldName="categoryIds"
                        multiple={true}
                        isFetching={isFetchingCategories}
                        options={categories}
                        getOptionValue={x => x.id}
                        getOptionLabel={x => x.name}
                        disabled={submitting}
                    />
                    <SelectIdFieldInput<CustomerTag>
                        label="Tags"
                        fieldName="tagIds"
                        multiple={true}
                        isFetching={isFetchingTags}
                        options={tags}
                        getOptionValue={x => x.id}
                        getOptionLabel={x => x.tag}
                        disabled={submitting}
                    />
                    <SelectBooleanFieldInput
                        label="Archived"
                        fieldName="archived"
                        disabled={submitting}
                    />
                </>
            )}
        />
    );
}
