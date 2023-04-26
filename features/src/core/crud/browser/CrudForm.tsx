import { Box, Button, GridProps } from "@mui/material";
import { MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { MutationHooks, QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useMemo } from "react";
import { Form } from "react-final-form";
import { useNavigate, useParams } from "react-router-dom";
import { getInitialValues } from "../../form/initialValues";
import { SubmitWithConfirmation } from "../../layout/browser/Confirmations";
import { GridHS } from "../../layout/browser/Grid";
import Loading from "../../layout/browser/Loading";
import { Panel, PanelHeader } from "../../layout/browser/Panel";
import { SnackbarNotification } from "../../layout/browser/SnackbarNotification";
import { Entity, ValidationFailure } from "../../models";
import { toNumericId } from "../../utils";
import arrayMutators from 'final-form-arrays';
import { getFormErrorMessage } from "../../form/validation";

type ArrayFunctions = {
    push: <T>(fielName: string, model?: T) => void;
    remove: (fielName: string, index: number) => void;
}

interface CrudFormProps<TModel extends Entity> extends GridProps {
    title: string;
    path: string;
    defaultValues: Partial<TModel>;
    detailsEndpoint: QueryHooks<QueryDefinition<number, any, any, TModel, any>>;
    addOrUpdateEndpoint: MutationHooks<MutationDefinition<any, any, any, any, any>>;
    confirmationMessage?: (model: TModel) => string | undefined;
    acknowledgeMessage?: (model: TModel) => string | undefined;
    render: (submitting: boolean, arrayFunctions: ArrayFunctions) => JSX.Element;
    renderButtons?: (submitting: boolean, arrayFunctions: ArrayFunctions) => JSX.Element;
    getValidationMessage?: (error: ValidationFailure) => string;
}

export default function CrudForm<TModel extends Entity>({ 
    title, path, defaultValues, 
    detailsEndpoint, addOrUpdateEndpoint, 
    confirmationMessage, acknowledgeMessage,
    render, renderButtons, 
    getValidationMessage,
    ...gridProps 
}: CrudFormProps<TModel>) {
    const navigate = useNavigate();

    const { id } = useParams();
    const modelId = toNumericId(id);

    const { isFetching, data } = detailsEndpoint.useQuery(modelId, { skip: modelId === 0 });
    const model = modelId > 0 && data;

    const [addOrUpdate] = addOrUpdateEndpoint.useMutation();

    const initialValues = useMemo(() => {
        return getInitialValues(model, defaultValues)
    }, [model, defaultValues]);

    const onSubmit = async (model: TModel) => {
        try {
            const { id } = await addOrUpdate(model).unwrap();

            navigate(`${path}/${id}`);
        }
        catch(ex) {
            return getFormErrorMessage(ex, undefined, getValidationMessage);
        }
    };

    const onCancel = () => navigate(`${path}${modelId === 0 ? '' : `/${modelId}`}`);

    return (
        <Panel {...gridProps}>
            <PanelHeader title={modelId > 0 ? `Edit ${title}` : `New ${title}`} onClose={onCancel} />
            {
                isFetching && <Loading />
            }
            {
                !isFetching &&
                <Form
                    initialValues={initialValues}
                    initialValuesEqual={(a, b) => a === b}
                    mutators={arrayMutators as any}
                    onSubmit={onSubmit}
                    render={({ handleSubmit, submitting, submitError, hasValidationErrors, validating, values, form: { mutators } }) => {
                        const confirmation = confirmationMessage && confirmationMessage(values);
                        let acknowledge: string | undefined = undefined;
                        if(confirmation && acknowledgeMessage){
                            acknowledge = acknowledgeMessage(values);
                        }

                        return (
                            <form onSubmit={handleSubmit} style={{ height: "calc(100% - 57px)" }}>
                                {submitting && <Loading floating={true} />}
                                {!submitting && submitError && <SnackbarNotification severity="error" message={submitError} />}
                                <Box sx={{ height: "calc(100% - 57px)", overflow: 'auto' }}>
                                    {render(submitting, mutators as any)}
                                </Box>
                                <GridHS container justifyContent="flex-end" columnSpacing={2} sx={{ px: 2, py: 1 }}>
                                    {renderButtons && renderButtons(submitting, mutators as any)}
                                    <GridHS>
                                        {
                                            !hasValidationErrors && confirmation
                                                ? <SubmitWithConfirmation
                                                    text="Save"
                                                    disabled={submitting || validating}
                                                    confirmationMessage={confirmation}
                                                    acknowledgeMessage={acknowledge}
                                                />
                                                : <Button type="submit" variant="contained" disabled={submitting || validating} color="success">Save</Button>
                                        }
                                    </GridHS>
                                    <GridHS>
                                        <Button onClick={onCancel} variant="contained" color="error">Cancel</Button>
                                    </GridHS>
                                </GridHS>
                            </form>
                        );
                    }}
                />
            }
        </Panel>
    );
}
