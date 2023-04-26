import { useMemo } from "react";
import { BooleanFieldInput } from "../../../core/crud/mobile/BooleanFieldInput";
import CrudForm from "../../../core/crud/mobile/CrudForm";
import { DateFieldInput } from "../../../core/crud/mobile/DateFieldInput";
import { EnumFieldInput } from "../../../core/crud/mobile/EnumFieldInput";
import { NumberFieldInput } from "../../../core/crud/mobile/NumberFieldInput";
import { SelectIdFieldInput } from "../../../core/crud/mobile/SelectIdFieldInput";
import { SelectObjectFieldInput } from "../../../core/crud/mobile/SelectObjectFieldInput";
import { StringFieldInput } from "../../../core/crud/mobile/StringFieldInput";
import { Customer, CustomerCategory, CustomerTag, customerTitle, customersPath, customerTierList } from "../customerModels";
import { useCustomerCategoriesQuery, useCustomerTagsQuery, customerService, checkCustomerName } from "../customerService";
import { useAppDispatch } from "../../../core/hooks";

export default function CustomerForm() {
    const dispatch = useAppDispatch();
    
    const { isFetching: isFetchingCategories, data: categories } = useCustomerCategoriesQuery();
    const { isFetching: isFetchingTags, data: tags } = useCustomerTagsQuery();

    const defaultValues = useMemo<Partial<Customer>>(() => ({
        id: 0,
        rowVersion: undefined,
        name: '',
        standardTier: undefined,
        categoryId: undefined,
        overdueAccount: false,
        defaultDiscountPercentage: 0,
        createdAt: undefined,
        notes: '',
        tags: []
    }), []);

    return (
        <CrudForm<Customer>
            title={customerTitle}
            path={customersPath}
            defaultValues={defaultValues}
            detailsEndpoint={customerService.endpoints.customerById}
            addOrUpdateEndpoint={customerService.endpoints.addOrUpdateCustomer}
            render={submitting => (
                <>
                    <StringFieldInput 
                        label="Name" 
                        fieldName="name" 
                        require 
                        disabled={submitting} 
                        validateAsync={async (value, allValues: Customer) => {
                            try {
                                await dispatch(checkCustomerName({ name: value, id: allValues.id }));

                                return undefined;
                            }
                            catch {
                                return 'Duplicated';
                            }
                        }}  
                    />
                    <EnumFieldInput
                        label="Customer Tier"
                        fieldName="standardTier"
                        require
                        disabled={submitting}
                        options={customerTierList.list} 
                    />
                    <SelectIdFieldInput<CustomerCategory>
                        label="Category"
                        fieldName="categoryId"
                        isFetching={isFetchingCategories}
                        options={categories}
                        getOptionValue={x => x.id}
                        getOptionLabel={x => x.name}
                        require
                        disabled={submitting}
                    />
                    <SelectObjectFieldInput<CustomerTag>
                        label="Tags"
                        fieldName="tags"
                        isFetching={isFetchingTags}
                        multiple={true}
                        options={tags}
                        getOptionValue={x => x.id}
                        getOptionLabel={x => x.tag}
                        require
                        disabled={submitting}
                    />
                    <NumberFieldInput label="Default Discount" fieldName="defaultDiscountPercentage" min={0} max={100} unit="%" disabled={submitting} />
                    <BooleanFieldInput label="Overdue Account" fieldName="overdueAccount" disabled={submitting} />
                    <StringFieldInput label="Notes" fieldName="notes" multiline rows={3} disabled={submitting} />                    
                </>
            )}
        />
    );
}
