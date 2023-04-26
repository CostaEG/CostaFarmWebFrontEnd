import { Box, Button, GridProps } from "@mui/material";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { Form } from "react-final-form";
import { useSelector } from "react-redux";
import { Filter } from "../../models";
import { useAppDispatch } from "../../hooks";
import { getInitialValues } from "../../form/initialValues";
import { Panel } from "../../layout/browser/Panel";
import { GridHS } from "../../layout/browser/Grid";

interface CrudFilterFormProps<TFilter extends Filter> extends GridProps {
    defaultValues: Partial<TFilter>;
    selectFilter: (state: any) => TFilter;
    patchFilterActionCreator: ActionCreatorWithPayload<Partial<Filter>>;
    render: (submitting: boolean) => JSX.Element;
    onClose: () => void
}

export default function CrudFilterForm<TFilter extends Filter>({ defaultValues, selectFilter, patchFilterActionCreator, render, onClose, ...gridProps }: CrudFilterFormProps<TFilter>) {
    const dispatch = useAppDispatch();

    const filter = useSelector(selectFilter);

    const [resetToken, setResetToken] = useState(0);

    const initialValues = useMemo(() => {
        const initialValues = getInitialValues(resetToken > 0 ? defaultValues : filter, defaultValues);

        initialValues.skip = 0;

        return initialValues;
    }, [filter, defaultValues, resetToken]);

    const onSubmit = (model: TFilter) => {
        dispatch(patchFilterActionCreator(model));
        onClose();
    };

    return (
        <Panel {...gridProps}>
            <Form
                initialValues={initialValues}
                initialValuesEqual={(a, b) => a === b}
                onSubmit={onSubmit}
                render={({ handleSubmit, submitting, validating }) => (
                    <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                        <Box sx={{ height: "calc(100% - 57px)", overflow: 'auto' }}>
                            {render(submitting)}
                        </Box>
                        <GridHS container justifyContent="flex-end" columnSpacing={2} sx={{ px: 2, py: 1 }}>
                            <GridHS>
                                <Button type="submit" variant="contained" disabled={submitting || validating} color="success">Apply</Button>
                            </GridHS>
                            <GridHS>
                                <Button onClick={() => setResetToken(resetToken + 1)} disabled={submitting || validating} variant="contained" color="warning">Reset</Button>
                            </GridHS>
                            <GridHS>
                                <Button onClick={onClose} variant="contained" color="error">Cancel</Button>
                            </GridHS>
                        </GridHS>
                    </form>)}
            />
        </Panel>
    );
}
