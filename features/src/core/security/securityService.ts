import { api } from "../service";
import { Identity, Credentials, SecurityContext, TokenInfo } from "./securityModels";
import jwt_decode from "jwt-decode";

export const securityService = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<SecurityContext, Credentials>({
            query: (body) => ({
                url: 'login',
                method: 'POST',
                body,
            }),
            transformResponse: (token: TokenInfo) => {
                if (token) {
                    token.expiresAt = Math.floor(Date.now() / 1000) + token.expiresIn;

                    if(!token.identityToken)
                        throw new Error('Identity Token not found')

                    const identityTokenClaims = jwt_decode(token.identityToken) as any;
                    var identity: Identity = {
                        id: identityTokenClaims.sub,
                        name: identityTokenClaims.name,
                        impersonator: identityTokenClaims.impersonator
                    }

                    const accessTokenClaims = jwt_decode(token.accessToken) as any;

                    return {
                        identity: identity,
                        scopes: accessTokenClaims.scopes,
                        token: token
                    };
                }

                return {
                    identity: {
                        id: '',
                        name: 'Anonymous'
                    }
                };
            }
        }),
    }),
})

export const { useLoginMutation } = securityService;