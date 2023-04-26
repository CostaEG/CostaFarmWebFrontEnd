export function getInitialValues<T>(model: T | undefined, defaultValues: Partial<T>): Partial<T> {
    let initialValues = {};
    
    merge(initialValues, defaultValues, Boolean(model) ? model : defaultValues);

    return initialValues;
}

function merge(initialValues: any, defaultValues: any, model: any) {
    for (let propName in defaultValues) {
        if (defaultValues.hasOwnProperty(propName)) {
            let v1 = defaultValues[propName];
            let v2 = model.hasOwnProperty(propName) ? model[propName] : defaultValues[propName];
            var p1 = isPrimitive(v1);
            var p2 = isPrimitive(v2);
            if (p1 && p2) {
                initialValues[propName] = v2;
            }
            else {
                if (v1 instanceof Array || v2 instanceof Array) {
                    if (v2 instanceof Array)
                        initialValues[propName] = v2.map((x: any) => isPrimitive(x) ? x : Object.assign({}, x));
                    else
                        initialValues[propName] = [];
                }
                else if (!p1 && !p2) {
                    initialValues[propName] = {};
                    merge(initialValues[propName], defaultValues[propName], model[propName]);
                }
            }
        }
    }
}

function isPrimitive(obj: any) {
    var type = typeof obj;
    return obj === undefined || obj === null || (type !== 'object' && type !== "function") || obj instanceof Date;
}

const propertyPathPattern = /(\w+(?:\s*?\.\s*?\w+)*)/g;

export function getPropertyName<T>(exp: (model: T) => any) {
    
    let expStr = exp.toString();

    let match = propertyPathPattern.exec(expStr);
    if (!match)
        throw new Error('Invalid property path');
    
    let propertyPath: string = '';
    do {
        match = propertyPathPattern.exec(expStr);
        if (match) {
            propertyPath = match[0].split('.').filter((val, i) => i > 0).join(".");            
        }
    }
    while (match);
    
    if(!propertyPath)
        throw new Error('Invalid property path');

    return  propertyPath;
}