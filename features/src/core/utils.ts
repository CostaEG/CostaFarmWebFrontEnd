import { ThunkAction } from "@reduxjs/toolkit";

export function toNumericId(str: string | undefined): number {
    return !str ? 0 : parseInt(str) || 0;
}

export function shallowEqual(a: any, b: any) {
    if (a === b) {
      return true;
    }
    if (typeof a !== "object" || !a || typeof b !== "object" || !b) {
      return false;
    }
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b);
    for (var idx = 0; idx < keysA.length; idx++) {
      var key = keysA[idx];
      if (!bHasOwnProperty(key) || a[key] !== b[key]) {
        return false;
      }
    }
    return true;
}

export function trafficControllerThunkFactory<TParams, TResult>(actionCreator: (params: TParams) => any, debounce = 500) {

    let requestHandler: Promise<TResult> | undefined = undefined;
    let requestResolver: ((result: TResult) => void) | undefined = undefined;
    let requestRejector: ((reason?: any) => void) | undefined = undefined;
    let timerHandler: NodeJS.Timeout | undefined = undefined;
    let requestIdTracking = 1;
    let lastParams: TParams | undefined = undefined;
    let lastResult: TResult | undefined = undefined;

    return (params: TParams): ThunkAction<Promise<TResult | undefined>, any, any, any> => {

        return (dispatch) => {

            if(shallowEqual(lastParams, params)) {
                return Promise.resolve(lastResult);
            }

            if (!requestHandler) {
                requestHandler = new Promise<TResult>(
                    (resolve, reject) => {
                        requestResolver = resolve;
                        requestRejector = reject;
                    }                    
                );
            }

            if (timerHandler)
                clearTimeout(timerHandler);

            const requestId = ++requestIdTracking;
            lastParams = undefined;
            lastResult = undefined;
                        
            timerHandler = setTimeout(async () => {
                try {
                    const result = await dispatch(actionCreator(params)).unwrap();

                    if(requestId === requestIdTracking) {
                        requestHandler = undefined;
                        lastParams = params;
                        lastResult = result;
                        requestResolver && requestResolver(result);
                    }
                }
                catch(e) {
                    if(requestId === requestIdTracking) {
                        requestHandler = undefined;
                        requestRejector && requestRejector(e);
                    }
                }
            }, debounce);

            return requestHandler;
        }
    }
}