import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material';
import { login, logout } from './utils';
import { Field, Form } from 'react-final-form';
import { useFeatureTitle } from '../../layout/browser/useFeatureTitle';
import { useLoginMutation } from '../securityService';
import { useAppDispatch } from '../../hooks';
import { Credentials, SecurityContext } from '../securityModels';
import { GridHS } from '../../layout/browser/Grid';
import { getPropertyName } from '../../form/initialValues';
import { getFormErrorMessage, validator } from '../../form/validation';
import ClientOAuth2 from './client-oauth2';
import { manifest } from '../../manifest';
import jwt_decode from 'jwt-decode';
import { setRefreshTokenHandler } from '../../service';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../layout/browser/Loading';
import './login.css';

const logo = require('../../layout/browser/assets/Costa-Farms-Logo-new.png');

export default function Login() {
  useFeatureTitle('Sign in');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loginRequest] = useLoginMutation();

  useEffect(() => {
    if (location.pathname === '/token-callback') {
      const getToken = async () => {
        const authClient = createAuthClient();
        const tokenInfo = await authClient.code.getToken(
          document.location.href
        );

        const securityContext = createSecurityContext(tokenInfo);

        login(dispatch, securityContext);

        navigate('/', { replace: true });
      };
      getToken().catch(console.error);
    } else if (location.pathname !== '' && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [location, dispatch, navigate]);

  if (manifest.authMode === 'oauth 2.0') {
    if (location.pathname === '/token-callback') {
      return (
        <Stack direction="row" justifyContent="center">
          <Loading />
        </Stack>
      );
    }

    return (
      <Box
        className="login-box"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} width={'300'} alt="Logo" />
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ my: 3 }}
            onClick={async () => {
              const authClient = createAuthClient();

              document.location.href = await authClient.code.getUri();
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img src={logo} alt="Logo" />
      <Box sx={{ mt: 2 }}>
        <Form
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={async (credentials: Credentials) => {
            try {
              const securityContext = await loginRequest(credentials).unwrap();

              login(dispatch, securityContext);

              navigate('/', { replace: true });
            } catch (ex) {
              return getFormErrorMessage(ex, 'Invalid credentials');
            }
          }}
          render={({ handleSubmit, submitting, submitError }) => (
            <form
              onSubmit={handleSubmit}
              style={{ height: 'calc(100% - 57px)' }}
            >
              {submitError && <Alert severity="error">{submitError}</Alert>}
              <GridHS container mt={1}>
                <GridHS xs={12}>
                  <Field<string>
                    name={getPropertyName<Credentials>((x) => x.username)}
                    validate={validator().require().build()}
                  >
                    {({
                      input: { name, value, onChange, onBlur, onFocus },
                      meta: { error, touched },
                    }) => (
                      <>
                        <label className="info-field" htmlFor={name}>
                          Username
                        </label>
                        <TextField
                          autoFocus
                          autoComplete="username"
                          size="small"
                          disabled={submitting}
                          fullWidth
                          name={name}
                          value={value}
                          error={Boolean(touched && error)}
                          helperText={(touched && error) || ' '}
                          onChange={onChange}
                          onBlur={onBlur}
                          onFocus={onFocus}
                        />
                      </>
                    )}
                  </Field>
                </GridHS>
                <GridHS xs={12}>
                  <Field<string>
                    name={getPropertyName<Credentials>((x) => x.password)}
                    validate={validator().require().build()}
                  >
                    {({
                      input: { name, value, onChange, onBlur, onFocus },
                      meta: { error, touched },
                    }) => (
                      <>
                        <label className="info-field" htmlFor={name}>
                          Password
                        </label>
                        <TextField
                          autoComplete="current-password"
                          type="password"
                          size="small"
                          disabled={submitting}
                          fullWidth
                          name={name}
                          value={value}
                          error={Boolean(touched && error)}
                          helperText={(touched && error) || ' '}
                          onChange={onChange}
                          onBlur={onBlur}
                          onFocus={onFocus}
                        />
                      </>
                    )}
                  </Field>
                </GridHS>
              </GridHS>
              <Box sx={{ position: 'relative' }}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ my: 3 }}
                  disabled={submitting}
                >
                  Sign In
                </Button>
                {submitting && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-10px',
                      marginLeft: '-10px',
                    }}
                  />
                )}
              </Box>
            </form>
          )}
        />
      </Box>
    </Box>
  );
}

setRefreshTokenHandler(async (refreshToken, dispatch) => {
  const authClient = createAuthClient();

  try {
    const tokenInfo = await authClient.code.refreshToken(refreshToken);

    const securityContext = createSecurityContext(tokenInfo);

    login(dispatch as AppDispatch, securityContext);

    return true;
  } catch {
    logout(dispatch as AppDispatch);

    return false;
  }
});

function createAuthClient() {
  return new ClientOAuth2({
    authorizationUri: manifest.authUrl,
    accessTokenUri: manifest.tokenUrl,
    redirectUri: `${
      document.location.protocol + '//' + document.location.host
    }/token-callback`,
    clientId: manifest.clientId,
    scopes: manifest.scopes,
  });
}

function createSecurityContext(tokenInfo: any) {
  const accessTokenClaims = jwt_decode(tokenInfo.data.access_token) as any;

  const expiresIn = parseInt(tokenInfo.data.expires_in);
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  const securityContext: SecurityContext = {
    identity: {
      id: accessTokenClaims.sub,
      name: accessTokenClaims.name,
    },
    scopes: accessTokenClaims.roles,
    token: {
      expiresAt,
      expiresIn,
      accessToken: tokenInfo.data.access_token,
      refreshToken: tokenInfo.data.refresh_token,
    },
  };

  return securityContext;
}
