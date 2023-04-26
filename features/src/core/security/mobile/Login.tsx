import { Ionicons } from "@expo/vector-icons";
import { Button, Center, Input, Stack, Text, Icon, Alert, FormControl } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Field, Form } from "react-final-form";
import { login, logout } from "./utils";
import { getFormErrorMessage, validator } from "../../form/validation";
import { useAppDispatch } from "../../hooks";
import { Credentials, SecurityContext } from "../securityModels";
import { useLoginMutation } from "../securityService";
import { manifest } from "../../manifest";
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, refreshAsync, ResponseType, DiscoveryDocument } from "expo-auth-session";
import jwt_decode from "jwt-decode";
import { setRefreshTokenHandler } from "../../service";
import { AppDispatch } from "../../store";
import { useLocation, useNavigate } from "react-router-native";

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(location.pathname !== "" && location.pathname !== "/") {
            navigate('/', { replace: true });
        }
    }, [location, navigate])

    const [loginRequest] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    if (manifest.authMode === "oauth 2.0") {
        return (
            <OAuth2Login />
        );
    }

    return (
        <Form
            initialValues={{
                username: '',
                password: ''
            }}
            onSubmit={async (credentials: Credentials) => {
                try {
                    const securityContext = await loginRequest(credentials).unwrap();

                    login(dispatch, securityContext);
                }
                catch (ex) {
                    return getFormErrorMessage(ex, 'Invalid credentials');
                }
            }}
            render={({ handleSubmit, submitting, submitError }) => (
                <Center flex={1}>
                    <Stack width="90%" maxWidth={500}>
                        <Center mb={3}>
                            <Image style={{ maxWidth: 320 }} resizeMode="contain" source={require('../../../../../assets/logo.png')} />
                        </Center>
                        {submitError && <Alert status="error">{submitError}</Alert>}
                        <Field<string> name="username" validate={validator().require().build()}>
                            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                                <FormControl isInvalid={Boolean(touched && error)}>
                                    <FormControl.Label>Username</FormControl.Label>
                                    <Input p="3"
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        isDisabled={submitting}
                                        value={value}
                                        onFocus={() => onFocus()}
                                        onBlur={() => onBlur()}
                                        onChangeText={value => onChange(value)}
                                    />
                                    {
                                        touched && error
                                            ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
                                            : <FormControl.HelperText>{' '}</FormControl.HelperText>
                                    }
                                </FormControl>
                            )}
                        </Field>
                        <Field<string> name="password" validate={validator().require().build()}>
                            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                                <FormControl isInvalid={Boolean(touched && error)}>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input p="3"
                                        isDisabled={submitting}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        value={value}
                                        onFocus={() => onFocus()}
                                        onBlur={() => onBlur()}
                                        onChangeText={value => onChange(value)}
                                        type={showPassword ? 'text' : 'password'}
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                                <Icon mr="2" name={!showPassword ? 'eye-off-outline' : 'eye-outline'} as={Ionicons} size={7} />
                                            </TouchableOpacity>
                                        }
                                    />
                                    {
                                        touched && error
                                            ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
                                            : <FormControl.HelperText>{' '}</FormControl.HelperText>
                                    }
                                </FormControl>
                            )}
                        </Field>
                        <Button mt="4" size="lg" h="50"
                            isLoading={submitting}
                            isDisabled={submitting}
                            onPress={handleSubmit}
                        >
                            <Text color="white" fontSize="lg">Sign In</Text>
                        </Button>
                    </Stack>
                </Center>
            )}
        />
    );
}

const discovery: DiscoveryDocument = {
    authorizationEndpoint: manifest.authUrl,
    tokenEndpoint: manifest.tokenUrl
};

function OAuth2Login() {
    const dispatch = useAppDispatch();

    const redirectUri = makeRedirectUri({ path: 'redirect' });

    const [request, _, promptAsync] = useAuthRequest({
        clientId: manifest.clientId,
        responseType: ResponseType.Code,
        usePKCE: true,
        redirectUri,
        scopes: manifest.scopes
    },
        discovery
    );

    return (
        <Center flex={1}>
            <Stack width="90%" maxWidth={500}>
                <Center mb={5}>
                    <Image style={{ maxWidth: 320 }} resizeMode="contain" source={require('../../../../../assets/logo.png')} />
                </Center>
                <Button mt="5" size="lg" h="50"
                    isDisabled={!request}
                    onPress={async () => {
                        try {
                            const response = await promptAsync();

                            if (response.type === "success" && response.params?.code) {
                                const tokenInfo = await exchangeCodeAsync({
                                    clientId: manifest.clientId,
                                    redirectUri,
                                    code: response.params.code,
                                    extraParams: {
                                        code_verifier: request?.codeVerifier || "",
                                    },
                                },
                                    discovery
                                );

                                const securityContext = createSecurityContext(tokenInfo);

                                login(dispatch, securityContext);
                            }
                        }
                        catch (ex) {
                            console.error(ex);
                        }
                    }}
                >
                    <Text color="white" fontSize="lg">Sign In</Text>
                </Button>
            </Stack>
        </Center>
    );
}

setRefreshTokenHandler(async (refreshToken, dispatch) => {
    try {
        const tokenInfo = await refreshAsync({
            clientId: manifest.clientId,
            refreshToken: refreshToken
        },
            discovery
        );

        const securityContext = createSecurityContext(tokenInfo);

        login(dispatch as AppDispatch, securityContext);

        return true;
    }
    catch {
        logout(dispatch as AppDispatch);
        
        return false;
    }
});

function createSecurityContext(tokenInfo: any) {
    const accessTokenClaims = jwt_decode(tokenInfo.accessToken) as any;

    const expiresIn = tokenInfo.expiresIn || 0;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const securityContext: SecurityContext = {
        identity: {
            id: accessTokenClaims.sub,
            name: accessTokenClaims.name
        },
        scopes: accessTokenClaims.roles,
        token: {
            expiresAt,
            expiresIn,
            accessToken: tokenInfo.accessToken,
            refreshToken: tokenInfo.refreshToken,
        }
    };

    return securityContext;
}
