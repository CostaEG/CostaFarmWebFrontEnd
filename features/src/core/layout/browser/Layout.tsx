import { Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import { AppBar, appBarHeight } from './AppBar';
import { MainMenu, DrawerHeader } from './MainMenu';
import NotFound from "./NotFound";
import { Suspense } from "react";
import Loading from "./Loading";
import { useFeatureTitle } from "./useFeatureTitle";
import { getRoutes } from "../../menu/getRoutes";
import { MainMenuItem } from "../../menu";
import Authorize from "../../security/Authorize";
import Unauthorized from "../../security/browser/Unauthorized";
import GlobalError from "./GlobalError";
import { ErrorBoundary } from "./ErrorBoundary";
import Empty from "./Empty";

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', height: "100vh" }}>
            <AppBar/>
            <MainMenu/>
            <Box component="main" sx={{ flexGrow: 1, p: 0, height: `calc(100% - ${appBarHeight}px)`}}>
                <DrawerHeader />
                <GlobalError/>
                <Routes>
                    {getRoutes(undefined).map((x, i) => (
                        <Route 
                            key={i} 
                            path={x.routeInfo.routePath} 
                            element={
                                <ItemLayout item={x.item}/>
                            }
                        />
                    ))}
                    <Route path="token-callback" element={<Empty/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Box>
        </Box>
    );
}

function ItemLayout({ item }: { item: MainMenuItem }){
    useFeatureTitle(item.title);

    return (
        <Authorize scopes={item.scopes} UnauthorizedComponent={Unauthorized}>
            <Suspense fallback={<Loading/>}>
                <ErrorBoundary key={item.path}>
                    <item.component/>
                </ErrorBoundary>
            </Suspense>
        </Authorize>
    );
}
