import { Alert, Box, GridProps } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutline, EditOutlined, RestoreOutlined } from "@mui/icons-material";
import { MutationDefinition, QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { MutationHooks, QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FloatingButton, FloatingButtons } from "../../layout/browser/FloatingButtons";
import { Entity } from "../../models";
import { toNumericId } from "../../utils";
import { Panel, PanelHeader } from "../../layout/browser/Panel";
import Loading from "../../layout/browser/Loading";
import NotFound from "../../layout/browser/NotFound";
import { SnackbarNotification } from "../../layout/browser/SnackbarNotification";
import { useState } from "react";
import { ConfirmationModal } from "../../layout/browser/Confirmations";
import { getErrorMessage } from "../../form/validation";

interface CrudDetailsProps<TModel extends Entity> extends GridProps {
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

export default function CrudDetails<TModel extends Entity>({ title, path, detailsEndpoint, render, hideEditButton, archiveEndpoint, recoverEndpoint, actions, ...gridProps }: CrudDetailsProps<TModel>) {
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
			color: "warning",
			icon: <EditOutlined />,
			onClick: () => data && navigate(`${path}/${data.id}/form`)
		});
	}

	if (archive && data && !data.archivedBy) {
		floatingButtons.push({
			title: "Archive",
			color: "error",
			icon: <DeleteOutline />,
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
			color: "warning",
			icon: <RestoreOutlined />,
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
		<Panel {...gridProps}>
			<PanelHeader title={`${title} Details`} onClose={() => navigate(path)} />			
			{
				isFetching ? <Loading /> : !data && <NotFound />
			}
			{
				!isFetching && data &&
				<>
					<Box sx={{ height: "calc(100% - 57px)", overflow: 'auto' }}>
						{
							confirmationHandler &&
							<ConfirmationModal
								message={confirmationHandler.confirmation}
								yes={confirmationHandler.handler}
								no={() => setConfirmationHandler(undefined)}
							/>
						}
						{(archiveResult?.isLoading || recoverResult?.isLoading) && <Loading floating={true} />}
						{(archiveResult?.isError || recoverResult?.isError) && <SnackbarNotification severity="error" message={getErrorMessage(archiveResult?.error || recoverResult?.error)} />}
						{data.archivedBy && <Alert severity="warning">Archived</Alert>}
						{render(data)}
					</Box>
					{
						floatingButtons.length > 0 && <FloatingButtons actions={floatingButtons} />
					}
				</>
			}
		</Panel>
	);
}
