import { GridProps } from "@mui/material";
import { useMemo } from "react";
import CrudFilterForm from "../../../core/crud/browser/CrudFilterForm";
import { SelectIdFieldInput } from "../../../core/crud/browser/SelectIdFieldInput";
import { StringFieldInput } from "../../../core/crud/browser/StringFieldInput";
import { GridHS } from "../../../core/layout/browser/Grid";
import { SalesOrderFilter, SalesOrderStatus, salesOrderStatusList } from "../salesOrderModels";
import { selectSalesOrderFilter, patchSalesOrderFilter } from "../salerOrderSlice";
import { getPropertyName } from "../../../core/form/initialValues";
import { SelectBooleanFieldInput } from "../../../core/crud/browser/SelectBooleanFieldInput";

interface SalesOrderFilterFormProps extends GridProps {
    onClose: () => void
}

export default function SalesOrderFilterForm({ onClose, ...gridProps }: SalesOrderFilterFormProps) {

    const defaultValues = useMemo<Partial<SalesOrderFilter>>(() => ({
        search: '',
        orderStatus: undefined,
        archived: undefined
    }), []);

    return (
        <CrudFilterForm<SalesOrderFilter>
            defaultValues={defaultValues}
            selectFilter={selectSalesOrderFilter}
            patchFilterActionCreator={patchSalesOrderFilter}
            render={submitting => (
                <GridHS container padding={2} columnSpacing={2}>
                    <GridHS xs={12}>
                        <StringFieldInput label="Search" fieldName={getPropertyName<SalesOrderFilter>(x => x.search)} disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12}>
                        <SelectIdFieldInput<SalesOrderStatus>
                            label="Status"
                            fieldName={getPropertyName<SalesOrderFilter>(x => x.orderStatus)}
                            options={salesOrderStatusList.ids}
                            getOptionValue={x => x}
                            getOptionLabel={x => salesOrderStatusList.values[x].label}
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12}>
                        <SelectBooleanFieldInput
                            label="Archived"
                            fieldName={getPropertyName<SalesOrderFilter>(x => x.archived)}
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
