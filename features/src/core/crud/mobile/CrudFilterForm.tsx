import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { Form } from "react-final-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-native";
import { Flex, Icon } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { Filter } from "../../models";
import { getInitialValues } from "../../form/initialValues";
import { useAppDispatch } from "../../hooks";
import { FloatingButtons } from "../../layout/mobile/FloatingButtons";
import { Panel, PanelHeader } from "../../layout/mobile/Panel";

interface CrudFilterFormProps<TFilter extends Filter> {
    title: string;
    path: string;
    defaultValues: Partial<TFilter>;
    selectFilter: (state: any) => TFilter;
    patchFilterActionCreator: ActionCreatorWithPayload<Partial<Filter>>;
    render: (submitting: boolean) => JSX.Element;
}

export default function CrudFilterForm<TFilter extends Filter>({ title, path, defaultValues, selectFilter, patchFilterActionCreator, render }: CrudFilterFormProps<TFilter>) {
    const navigate = useNavigate();
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
        navigate(-1);
    };

    return (
        <Panel>
            <PanelHeader title={`${title} Filters`} />
            <Form
                initialValues={initialValues}
                initialValuesEqual={(a, b) => a === b}
                onSubmit={onSubmit}
                render={({ handleSubmit, submitting, validating, form }) => (
                    <Flex flex={1}>
                        <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
                            <Flex pt={4} direction="row" wrap="wrap">
                                {render(submitting)}
                            </Flex>
                        </ScrollView>
                        <FloatingButtons actions={[
                            {
                                title: "Apply",
                                color: "#4caf50",
                                icon: <Icon name="checkmark" as={Ionicons} color="white" size={6} />,
                                disable: submitting || validating,
                                onClick: handleSubmit
                            },
                            {
                                title: "Reset",
                                color: "#f0ad4e",
                                icon: <Icon name="refresh" as={MaterialIcons} color="white" size={6} />,
                                disable: submitting || validating,
                                onClick: () => setResetToken(resetToken + 1)
                            }
                        ]} />
                    </Flex>
                )}
            />
        </Panel>
    );
}
