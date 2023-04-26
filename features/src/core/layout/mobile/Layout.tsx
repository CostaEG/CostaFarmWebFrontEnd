import { Routes, Route } from "react-router-native";
import NotFound from "./NotFound";
import { MainMenu } from "./MainMenu";
import { getRoutes } from "../../menu/getRoutes";
import { MainMenuItem } from "../../menu";
import Authorize from "../../security/Authorize";
import Unauthorized from "../../security/mobile/Unauthorized";
import GlobalError from "./GlobalError";
import { ErrorBoundary } from "./ErrorBoundary";

export default function Layout() {
    return (
        <>
            <GlobalError/>
            <Routes>
                <Route path="/" element={<MainMenu/>}/>
                {getRoutes(undefined).map((x, i) => (
                    <Route key={i} path={x.routeInfo.routePath} element={
                        <ItemLayout item={x.item}/>
                    }/>
                ))}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    );
}

function ItemLayout({ item }: { item: MainMenuItem }){    
    return (
        <Authorize scopes={item.scopes} UnauthorizedComponent={Unauthorized}>
            <ErrorBoundary>
                <item.component/>
            </ErrorBoundary>
        </Authorize>
    );
}