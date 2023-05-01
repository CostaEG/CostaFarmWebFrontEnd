export interface Manifest {
    title: string;
    apiUrl: string;
    authMode: "oauth 2.0" | "user & password"    
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    scopes: string[];
}

export let manifest: Manifest = {
    title: "HS Plaform",
    authMode: "oauth 2.0",
    //apiUrl: "http://10.0.0.180:3001",
    apiUrl: "http://192.168.1.239:5263",
    authUrl: "https://login.microsoftonline.com/e284194e-3218-4557-be77-6643231d35b1/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/e284194e-3218-4557-be77-6643231d35b1/oauth2/v2.0/token",
    clientId: "1894a6d1-f5f5-40b0-acdc-a219976f91a0",
    scopes: ["offline_access", "api://1894a6d1-f5f5-40b0-acdc-a219976f91a0/webaccess"]
};

switch(process.env['NODE_ENV']) {
    case 'production': 
        manifest.apiUrl = "http://192.168.86.55:5263";
        manifest.authUrl = "https://login.microsoftonline.com/81b3e404-f0eb-4596-9cbb-1768eaa0bbb4/oauth2/v2.0/authorize";
        manifest.tokenUrl = "https://login.microsoftonline.com/81b3e404-f0eb-4596-9cbb-1768eaa0bbb4/oauth2/v2.0/token";
        manifest.clientId = "d747a0c2-0a2c-4d7e-9165-d38027958541";
        manifest.scopes = ["offline_access", "api://d747a0c2-0a2c-4d7e-9165-d38027958541/app"];
    break;
    case 'test': 

    break;    
    case 'development': 

    break;    
}