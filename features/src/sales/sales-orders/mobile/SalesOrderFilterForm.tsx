import { useMemo } from "react";
import CrudFilterForm from "../../../core/crud/mobile/CrudFilterForm";
import { SelectIdFieldInput } from "../../../core/crud/mobile/SelectIdFieldInput";
import { StringFieldInput } from "../../../core/crud/mobile/StringFieldInput";
import { SalesOrderFilter, salesOrderTitle, salesOrdersPath, salesOrderStatusList, SalesOrderStatus } from "../salesOrderModels";
import { selectSalesOrderFilter, patchSalesOrderFilter } from "../salerOrderSlice";
import { SelectBooleanFieldInput } from "../../../core/crud/mobile/SelectBooleanFieldInput";

export default function SalesOrderFilterForm() {

    const defaultValues = useMemo<Partial<SalesOrderFilter>>(() => ({
        search: '',
        orderStatus: undefined,
        archived: undefined
    }), []);

    return (
        <CrudFilterForm<SalesOrderFilter>
            title={salesOrderTitle}
            path={salesOrdersPath}        
            defaultValues={defaultValues}
            selectFilter={selectSalesOrderFilter}
            patchFilterActionCreator={patchSalesOrderFilter}
            render={submitting => (
                <>
                    <StringFieldInput label="Search" fieldName="search" disabled={submitting} fullWidth/>
                    <SelectIdFieldInput<SalesOrderStatus>
                        label="Status"
                        fieldName="orderStatus"
                        multiple={true}
                        options={salesOrderStatusList.ids}
                        getOptionValue={x => x}
                        getOptionLabel={x => salesOrderStatusList.values[x].label}
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
