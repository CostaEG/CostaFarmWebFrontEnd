import { MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { MutationHooks, QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useNavigate, useParams } from "react-router-native";
import { Alert, Flex, Icon } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { Entity } from "../../models";
import { FloatingButton, FloatingButtons } from "../../layout/mobile/FloatingButtons";
import { toNumericId } from "../../utils";
import Loading from "../../layout/mobile/Loading";
import NotFound from "../../layout/mobile/NotFound";
import { Panel, PanelHeader } from "../../layout/mobile/Panel";
import { ErrorNotification } from "../../layout/mobile/ErrorNotification";
import { useState } from "react";
import { ConfirmationModal } from "../../layout/mobile/Confirmations";
import { getErrorMessage } from "../../form/validation";

interface CrudDetailsProps<TModel extends Entity> {
	title: string;
	path: string;
	detailsEndpoint: QueryHooks<QueryDefinition<number, any, any, TModel, any>>;
	hideEditButton?: boolean;
	archiveEndpoint?: MutationHooks<MutationDefinition<any, any, any, any, any>>;
    recoverEndpoint?: MutationHooks<MutationDefinition<any, any, any, any, any>>;    
	render: (model: TModel) => JSX.Element;
	actions?: FloatingButton[];
}

type ConfirmationHandler = { confirmation: string, handler: () => void };

export default function CrudDetails<TModel extends Entity>({ title, path, detailsEndpoint, render, hideEditButton, archiveEndpoint, recoverEndpoint, actions }: CrudDetailsProps<TModel>) {
	const navigate = useNavigate();

	const { id } = useParams();
	const modelId = toNumericId(id);

	const { isFetching, data, refetch } = detailsEndpoint.useQuery(modelId, { skip: modelId === 0 });
	const [archive, archiveResult] = archiveEndpoint?.useMutation() || [];
	const [recover, recoverResult] = recoverEndpoint?.useMutation() || [];

	const [confirmationHandler, setConfirmationHandler] = useState<ConfirmationHandler | undefined>(undefined);
	
	const floatingButtons: FloatingButton[] = [];

	if (!hideEditButton && data && !data.archivedBy) {
		floatingButtons.push({
			title: "Edit",
			color: "#f0ad4e",
			icon: <Icon name="edit" as={MaterialIcons} color="white" size={6} />,
			onClick: () => data && navigate(`${path}/${data.id}/form`)
		});
	}

	if (archive && data && !data.archivedBy) {
		floatingButtons.push({
			title: "Archive",
			color: "#ff5252",
			icon: <Icon name="trash-outline" as={Ionicons} color="white" size={6} />,
			onClick: () => setConfirmationHandler({
				confirmation: 'Are you sure you want to archive the element?',
				handler: async () => {
					try {
						setConfirmationHandler(undefined);

						await archive(data).unwrap();

						refetch();
					}
					catch {
						//ignore
					}
				}
			})
		});
	}

	if (recover && data && data.archivedBy) {
		floatingButtons.push({
			title: "Recover",
			color: "#f0ad4e",
			icon: <Icon name="restore" as={MaterialIcons} color="white" size={6} />,
			onClick: () => setConfirmationHandler({
				confirmation: 'Are you sure you want to recover the element?',
				handler: async () => {
					try {
						setConfirmationHandler(undefined);

						await recover(data).unwrap();

						refetch();
					}
					catch {
						//ignore
					}
				}
			})
		});
	}

	if (actions)
		floatingButtons.push(...actions);

	return (
		<Panel>
			<PanelHeader title={`${title} Details`} />
			{
				isFetching ? <Loading /> : !data && <NotFound />
			}
			{
				!isFetching && data &&
				<Flex flex={1} bg="#f5f5f5">
					<ScrollView contentContainerStyle={{ paddingHorizontal: 5 }}>
						<Flex pt={2} direction="row" wrap="wrap">
							{
								confirmationHandler &&
								<ConfirmationModal
									message={confirmationHandler.confirmation}
									yes={confirmationHandler.handler}
									no={() => setConfirmationHandler(undefined)}
								/>
							}
							{(archiveResult?.isLoading || recoverResult?.isLoading) && <Loading floating={true} />}
							{(archiveResult?.isError || recoverResult?.isError) && <ErrorNotification errorMessage={getErrorMessage(archiveResult?.error || recoverResult?.error)} />}
							{data.archivedBy && <Alert w="100%" status="warning">Archived</Alert>}
							{render(data)}
						</Flex>
					</ScrollView>
					{
						floatingButtons.length > 0 && <FloatingButtons active={false} actions={floatingButtons} />
					}
				</Flex>
			}
		</Panel>
	);
}