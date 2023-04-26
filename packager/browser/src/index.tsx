import 'react-app-polyfill/stable';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { store } from './workspace/core/store';
import { restoreIdentity } from './workspace/core/security/browser/utils';
import { restoreLayoutConfig } from './workspace/core/layout/utils';
import App from './workspace/core/layout/browser/App';

const container = document.getElementById('root')!;
const root = createRoot(container);

restoreIdentity(store.dispatch);
restoreLayoutConfig(store.dispatch);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();