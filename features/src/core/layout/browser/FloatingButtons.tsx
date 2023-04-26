import { MoreHorizOutlined, MoreVertOutlined } from "@mui/icons-material";
import { Box, Fab, PropTypes, SpeedDial, SpeedDialAction, SpeedDialIcon, useTheme } from "@mui/material"

export interface FloatingButton {
    title: string,
    icon: JSX.Element,
    color: PropTypes.Color | 'success' | 'error' | 'info' | 'warning',
    onClick: () => void
}

interface FloatingButtonsProps {
    actions: FloatingButton[]
}

export function FloatingButtons({ actions } : FloatingButtonsProps){
    const theme = useTheme();

    if(actions.length === 0)
        return null;

    if(actions.length === 1) {
        const action = actions[0];
        return (
            <Box sx={{ position: "relative" }}>
                <Fab color={action.color}
                    aria-label={action.title}
                    sx={{ position: "absolute", bottom: 15, right: 25 }}
                    onClick={action.onClick}
                >
                    {action.icon}
                </Fab>
            </Box>
        );
    }
    
    return (
        <Box sx={{ position: "relative" }}>
            <SpeedDial
                ariaLabel="options"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon icon={<MoreVertOutlined />} openIcon={<MoreHorizOutlined/>}/>}
            >
                {actions.map((x, i) => (
                    <SpeedDialAction 
                        key={i}
                        icon={x.icon}
                        tooltipOpen
                        tooltipTitle={x.title}
                        onClick={x.onClick}
                        FabProps={{
                            sx: { 
                                color: '#FFF', 
                                bgcolor: (theme.palette as any)[x.color].main,
                                '&:hover, &:focus': { bgcolor: (theme.palette as any)[x.color].dark }
                            }
                        }}                                           
                    />
                )).reverse()}
            </SpeedDial>
        </Box>
    );
}