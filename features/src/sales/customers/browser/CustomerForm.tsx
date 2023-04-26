import { GridProps } from "@mui/material";
import { useMemo } from "react";
import { BooleanFieldInput } from "../../../core/crud/browser/BooleanFieldInput";
import CrudForm from "../../../core/crud/browser/CrudForm";
import { EnumFieldInput } from "../../../core/crud/browser/EnumFieldInput";
import { NumberFieldInput } from "../../../core/crud/browser/NumberFieldInput";
import { SelectIdFieldInput } from "../../../core/crud/browser/SelectIdFieldInput";
import { SelectObjectFieldInput } from "../../../core/crud/browser/SelectObjectFieldInput";
import { StringFieldInput } from "../../../core/crud/browser/StringFieldInput";
import { GridHS } from "../../../core/layout/browser/Grid";
import { Customer, CustomerCategory, CustomerTag, customersPath, customerTitle, customerTierList } from "../customerModels";
import { useCustomerCategoriesQuery, useCustomerTagsQuery, customerService, checkCustomerName } from "../customerService";
import { getPropertyName } from "../../../core/form/initialValues";
import { useAppDispatch } from "../../../core/hooks";

export default function CustomerForm({ ...gridProps }: GridProps) {
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
                <GridHS container padding={2} columnSpacing={2}>
                    <GridHS xs={12} md={6}>
                        <StringFieldInput 
                            label="Name" 
                            fieldName={getPropertyName<Customer>(x => x.name)} 
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
                    </GridHS>
                    <GridHS xs={12}>
                        <EnumFieldInput
                            label="Customer Tier"
                            fieldName={getPropertyName<Customer>(x => x.standardTier)}
                            require
                            disabled={submitting}
                            options={customerTierList.list} />
                    </GridHS>
                    <GridHS xs={12} md={6}>
                        <SelectIdFieldInput<CustomerCategory>
                            label="Category"
                            fieldName={getPropertyName<Customer>(x => x.categoryId)}
                            isFetching={isFetchingCategories}
                            options={categories}
                            getOptionValue={x => x.id}
                            getOptionLabel={x => x.name}
                            require
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12} md={6}>
                        <SelectObjectFieldInput<CustomerTag>
                            label="Tags"
                            fieldName={getPropertyName<Customer>(x => x.tags)}
                            isFetching={isFetchingTags}
                            multiple={true}
                            options={tags}
                            getOptionValue={x => x.id}
                            getOptionLabel={x => x.tag}
                            require
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12} md={6}>
                        <NumberFieldInput label="Default Discount" fieldName={getPropertyName<Customer>(x => x.defaultDiscountPercentage)} min={0} max={100} unit="%" disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12}>
                        <BooleanFieldInput label="Overdue Account" fieldName={getPropertyName<Customer>(x => x.overdueAccount)} disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12}>
                        <StringFieldInput label="Notes" fieldName={getPropertyName<Customer>(x => x.notes)} multiline rows={3} disabled={submitting} />
                    </GridHS>
                </GridHS>
            )}
            {...gridProps}
        />
    );
}
