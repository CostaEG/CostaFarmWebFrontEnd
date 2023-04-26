import { MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { MutationHooks, QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useMemo, useState } from "react";
import { Form } from "react-final-form";
import { useNavigate, useParams } from "react-router-native";
import { Flex, Icon } from "native-base";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getInitialValues } from "../../form/initialValues";
import { ConfirmationModal } from "../../layout/mobile/Confirmations";
import { FloatingButton, FloatingButtons } from "../../layout/mobile/FloatingButtons";
import Loading from "../../layout/mobile/Loading";
import { Panel, PanelHeader } from "../../layout/mobile/Panel";
import { ErrorNotification } from "../../layout/mobile/ErrorNotification";
import { Entity, ValidationFailure } from "../../models";
import { toNumericId } from "../../utils";
import arrayMutators from 'final-form-arrays';
import { getFormErrorMessage } from "../../form/validation";

type ArrayFunctions = {
    push: <T>(fielName: string, model?: T) => void;
    remove: (fielName: string, index: number) => void;
}

interface CrudFormProps<TModel extends Entity> {
    title: string;
    path: string;
    defaultValues: Partial<TModel>;
    detailsEndpoint: QueryHooks<QueryDefinition<number, any, any, TModel, any>>;
    addOrUpdateEndpoint: MutationHooks<MutationDefinition<any, any, any, any, any>>;
    confirmationMessage?: (model: TModel) => string | undefined;
    acknowledgeMessage?: (model: TModel) => string | undefined;    
    render: (submitting: boolean, arrayFunctions: ArrayFunctions) => JSX.Element;
    getButtons?: (submitting: boolean, arrayFunctions: ArrayFunctions) => FloatingButton[];
    getValidationMessage?: (error: ValidationFailure) => string;
}

export default function CrudForm<TModel extends Entity>({ 
    title, path, defaultValues, 
    detailsEndpoint, addOrUpdateEndpoint, 
    confirmationMessage, acknowledgeMessage, 
    render, getButtons,
    getValidationMessage 
}: CrudFormProps<TModel>) {
    const navigate = useNavigate();

    const { id } = useParams();
    const modelId = toNumericId(id);

    const { isFetching, data } = detailsEndpoint.useQuery(modelId, { skip: modelId === 0 });
    const model = modelId > 0 && data;

    const [addOrUpdate] = addOrUpdateEndpoint.useMutation();

    const [showConfirmation, setShowConfirmation] = useState(false);

    const initialValues = useMemo(() => {
        return getInitialValues(model, defaultValues)
    }, [model, defaultValues]);

    const onSubmit = async (model: TModel) => {
        try {
            setShowConfirmation(false);
            
            const { id } = await addOrUpdate(model).unwrap();

            if (modelId > 0)
                navigate(-1);
            else
                navigate(`${path}/${id}`, { replace: true });
        }
        catch(ex) {
            return getFormErrorMessage(ex, undefined, getValidationMessage);
        }
    };
    
    return (
        <Panel>
            <PanelHeader title={modelId > 0 ? `Edit ${title}` : `New ${title}`} />
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
                            <>
                                {submitting && <Loading floating={true} />}
                                {!submitting && submitError && <ErrorNotification errorMessage={submitError} />}
                                {
                                    showConfirmation && confirmation &&
                                    <ConfirmationModal
                                        message={confirmation}
                                        acknowledgeMessage={acknowledge}
                                        yes={handleSubmit}
                                        no={() => setShowConfirmation(false)}
                                    />
                                }
                                <Flex flex={1}>
                                    <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
                                        <Flex pt={4} direction="row" wrap="wrap">
                                            {render(submitting, mutators as any)}
                                        </Flex>
                                    </ScrollView>
                                    <FloatingButtons actions={[
                                        ...((getButtons && getButtons(submitting, mutators as any)) || []),
                                        {
                                            title: "Save",
                                            color: "#4caf50",
                                            icon: <Icon name="save-outline" as={Ionicons} color="white" size={7} />,
                                            disable: submitting || validating,
                                            onClick: () => {
                                                if (!hasValidationErrors && confirmation)
                                                    setShowConfirmation(true);
                                                else
                                                    handleSubmit();
                                            }
                                        }
                                    ]} />
                                </Flex>
                            </>
                        );
                    }}
                />
            }
        </Panel>
    );
}
