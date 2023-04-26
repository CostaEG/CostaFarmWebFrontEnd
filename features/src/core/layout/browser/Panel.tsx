import { Close } from "@mui/icons-material";
import { GridProps, IconButton, Tooltip, Typography } from "@mui/material";
import { GridHS } from "./Grid";

export function Panel({ children, ...res }: GridProps) {
    return (
        <GridHS height="100%" borderRight="1px solid rgba(224, 224, 224, 1)" {...res}>
            <div className="panel-content">
                {children}
            </div>
        </GridHS>
    );
}

const headerStyles = {
    px: 2, 
    py: 1, 
    borderBottom: "1px solid rgba(224, 224, 224, 1);"
};

export function PanelHeader({ title, onClose }: { title: string, onClose?: () => void }) {
    return (
        <GridHS container sx={headerStyles}>
            <GridHS xs>
                <Typography variant="h6" sx={{ mt: 1 }}>
                    {title}
                </Typography>
            </GridHS>
            {
                onClose &&
                <GridHS>
                    <Tooltip title="Close">
                        <IconButton sx={{ ml: 1 }} onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Tooltip>
                </GridHS>
            }
        </GridHS>
    );
}