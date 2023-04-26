import { IconButton, Toolbar, Typography, styled, AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { drawerWidth } from './MainMenu';
import { selectFeatureTitle, selectIsMenuOpen, toggleLeftMenu } from '../layoutSlice';
import { saveLayoutConfig } from '../utils';
import { useAppDispatch, useAppSelector, useSecurityContext } from '../../hooks';
import { manifest } from '../../manifest';
import { logout } from '../../security/browser/utils';

const logo = require("./assets/mini-logo.png");

export const appBarHeight = 56;

interface StyledMuiAppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const StyledMuiAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<StyledMuiAppBarProps>(({ theme, open }) => ({
    color: 'rgb(60,64,67)',
    backgroundColor: '#fff',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


const StyledToolbar = styled(Toolbar)(() => ({
    '@media all': {
      minHeight: appBarHeight,
    },
}));

export function AppBar() {
    const securityContext = useSecurityContext();
    const featureTitle = useAppSelector(selectFeatureTitle);
    const open = useAppSelector(selectIsMenuOpen);    
    const dispatch = useAppDispatch();
    
    return (
        <StyledMuiAppBar position="fixed" open={open}>
            <StyledToolbar>
                <IconButton
                    color="inherit"
                    onClick={() => {
                        saveLayoutConfig({ isMenuOpen: !open });
                        dispatch(toggleLeftMenu());                        
                    }}
                    edge="start"
                    sx={{
                        marginRight: 3,
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <img src={logo} alt="Logo" />
                <Typography noWrap component="div" sx={{ ml: 2, flexGrow: 1, fontWeight: 'bold', fontSize: '1rem' }}>
                    {featureTitle || manifest.title}
                </Typography>
                <Typography noWrap component="div" sx={{ mr: 1, fontSize: '0.875rem' }}>
                    {`Hi, ${securityContext?.identity.name}`}
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={() => logout(dispatch)}
                >
                    <Logout />
                </IconButton>
            </StyledToolbar>
        </StyledMuiAppBar>
    );
}