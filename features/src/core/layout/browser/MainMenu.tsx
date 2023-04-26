import * as React from 'react';
import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';
import { Drawer as MuiDrawer, IconButton, Divider, Typography, Menu, MenuItem } from '@mui/material';
import { ChevronLeft, ChevronRight, ExpandMore, ExpandLess } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { openMenuCategory, selectIsMenuOpen, selectOpenedCategory, toggleLeftMenu } from '../layoutSlice';
import { useMatch, useNavigate } from 'react-router-dom';
import { saveLayoutConfig } from '../utils';
import { appBarHeight } from './AppBar';
import { useAppDispatch, useAppSelector, useSecurityContext } from '../../hooks';
import { getFilteredMenu } from '../../menu/getFilteredMenu';
import { MainMenuCategory, MainMenuItem } from '../../menu';
import { getCategoryRouteInfo, getItemRouteInfo } from '../../menu/getRoutes';

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: '#f6f8fc',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: '#f6f8fc',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    '@media all': {
        minHeight: appBarHeight,
      },
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export function MainMenu() {
    const theme = useTheme();
    const securityContext = useSecurityContext();
    const menu = getFilteredMenu(securityContext);
    const open = useAppSelector(selectIsMenuOpen);
    const dispatch = useAppDispatch();
    
    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={() => {
                    saveLayoutConfig({ isMenuOpen: !open });
                    dispatch(toggleLeftMenu());                    
                }}>
                    {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {menu.map((x, i) => {
                    if(!Boolean(x))
                        return <Divider key={`divider_${i}`} />;

                    const category = x as MainMenuCategory;
                    if(category.items)
                        return (
                            <HSMenuCategory key={category.title} category={category} open={open}/>
                        );

                    const item = x as MainMenuItem;
                    
                    return (
                        <HSMenuItem key={item.title} item={item} open={open}/>
                    );
                })}                
            </List>
        </Drawer>
    );
}

function HSMenuCategory({ category, open }: { category: MainMenuCategory, open: boolean }) {
    const dispatch = useAppDispatch();
    const routeInfo =  getCategoryRouteInfo(category);
    const match = useMatch({ path: routeInfo.routePath, end: true });
    const openedCategory = useAppSelector(selectOpenedCategory);
    const active = openedCategory ? openedCategory === routeInfo.path : Boolean(match);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const showFloatingMenu  = Boolean(anchorEl);
    const openFloatingMenu = (event: React.MouseEvent<HTMLElement>) => {
        currentlyHovering = true;
        if (open) {
            dispatch(openMenuCategory(openedCategory === routeInfo.path ? "other" : routeInfo.path));                    
        } else if(anchorEl !== event.currentTarget) {
            dispatch(openMenuCategory(routeInfo.path)); 
            setAnchorEl(event.currentTarget);
        }
    };
    const closeFloatingMenu = () => {
        setAnchorEl(null);
    };

    let currentlyHovering = false;  
    const handleHover = () => {
        currentlyHovering = true;
    }
    const requestCloseFloatingMenu = () => {
        currentlyHovering = false;
        setTimeout(() => {
          if (!currentlyHovering) {
            closeFloatingMenu();
          }
        }, 50);
    }
                
    return (
        <>            
            <MenuItemLayout 
                title={category.title} 
                icon={category.icon} 
                active={open ? !active && Boolean(match) : Boolean(match)} 
                highlight={active || Boolean(match)}
                expanded={open} 
                details={active || Boolean(match)}
                onClick={openFloatingMenu}
                onMouseEnter={open ? undefined : openFloatingMenu}
                onMouseLeave={open ? undefined : requestCloseFloatingMenu}/>
            {
                open && active && category.items.map(item => (
                    <HSMenuItem 
                        key={item.title} 
                        item={item} 
                        category={category} 
                        open={open}/>
                ))
            }
            {            
                !open && showFloatingMenu && 
                    <Menu
                        anchorEl={anchorEl}
                        id={category.path}
                        open={showFloatingMenu}
                        onClose={closeFloatingMenu}
                        MenuListProps={{ 
                            onMouseEnter: handleHover,
                            onMouseLeave: requestCloseFloatingMenu,
                            style: { backgroundColor: '#f6f8fc', pointerEvents: "auto" }
                        }}
                        PopoverClasses={{
                            root: "disabled-pointer-events"
                        }}
                        /*PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                ml: 1,
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 20,
                                    left: -5,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}*/
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    >
                        {category.items.map(item => (
                            <HSMenuItem 
                                key={item.title} 
                                item={item} 
                                open={open} 
                                category={category} 
                                closeCategory={closeFloatingMenu}/>
                        ))}
                    </Menu>
            }         
        </>
    );
}

function HSMenuItem({ item, open, category, closeCategory }: { item: MainMenuItem, open: boolean, category?: MainMenuCategory, closeCategory?: () => void }) {
    const navigate = useNavigate();
    const routeInfo = getItemRouteInfo(category, item);
    const match = useMatch({ path: routeInfo.routePath, end: true });
    
    if(!open && category)
        return (
            <MenuItem
                onClick={() => {
                    closeCategory && closeCategory();
                    navigate(routeInfo.path);                        
                }}
                sx={{
                    bgcolor: match ? '#d3e3fd' : undefined,
                    '&:hover, &:focus': { bgcolor: match ? '#d3e3fd' : undefined }
                }}
            >
                <ListItemIcon sx={{ color: match ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.54)'}}>
                    {React.createElement((Icons as any)[item.icon])}
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: '0.875rem', fontWeight: match ? '600' : undefined,}}>
                    {item.title}
                </Typography>}/>
            </MenuItem>
        );

    return (
        <MenuItemLayout 
            title={item.title} 
            icon={item.icon} 
            active={Boolean(match)}
            subItem={Boolean(category)} 
            expanded={Boolean(open || category)} 
            onClick={() => {
                navigate(routeInfo.path);
            }}/>
    );
}

function MenuItemLayout({ title, icon, active, highlight, expanded, subItem, details, onClick, onMouseEnter, onMouseLeave }: 
    { 
        title: string, icon: string, 
        active: boolean, highlight?: boolean, expanded: boolean, subItem?: boolean, details?: boolean, 
        onClick: (event: React.MouseEvent<HTMLElement>) => void,
        onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
        onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
    }) {
    return (
        <ListItemButton
            onClick={onClick}    
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}            
            sx={{
                minHeight: 48,
                justifyContent: expanded ? 'initial' : 'center',
                pl: subItem ? 4 : 2.5,
                bgcolor: active ? '#d3e3fd' : (highlight ? 'rgba(0, 0, 0, 0.04)' : undefined),
                '&:hover, &:focus': { bgcolor: active ? '#d3e3fd' : undefined }
            }}
        >
            <ListItemIcon
                sx={{
                    color: active ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.54)',
                    minWidth: 0,
                    mr: expanded ? 1 : 'auto',
                    justifyContent: 'center',
                }}
            >
                {React.createElement((Icons as any)[icon])}
            </ListItemIcon>
            <ListItemText primary={
                <Typography sx={{ fontSize: '0.875rem', fontWeight: active ? '600' : undefined,}}>
                    {title}
                </Typography>
            } sx={{ opacity: expanded ? 1 : 0 }} />
            { expanded && details === false && <ExpandMore sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem' }}/>}
            { expanded && details === true && <ExpandLess sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem' }}/>}
        </ListItemButton>
    );
}