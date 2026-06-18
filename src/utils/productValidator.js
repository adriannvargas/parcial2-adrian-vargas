export function validateProductBody(body, isComplete) {
    const validProperties = ["name", "category", "price", "stock", "supplier"];
    if (!body) {
        return{
            validation: false,
            message: "body is empty and is  required"
        };
    }

    const porpertiesInBody = Object.keys(body);

    for(const property of porpertiesInBody) {
        if(!validProperties.includes(property)) {
            return {
                validation: false,
                message: 'Body has a non allowed property called ${property}'
            };
        }
    }

    const  validPropertiesInBody = validProperties.filter(property =>
        body.hasOwnProperty(property)
    );

    if(isComplete) {
        if(validPropertiesInBody.length !== validProperties.length) {
            return {
                validation: false,
                message:"Body is not complete for use product API"
            };
        }
    } else {
        if(validPropertiesInBody.length === 0) {
            return {
                validation: false,
                message: "Body has none valid property"
            };
        }
    }

    return validateBodyCorrectness(body, validPropertiesInBody);
}

function validateBodyCorrectness(body, validPropertiesInBody) {
    let validationResult = null;

    for(let property of validPropertiesInBody) {
        switch (property) {
            case "name":
                validationResult = validateString(body.name, "name");
                if(!validationResult.validation) return validationResult;
                break;

            case "category":
                validationResult = validateString(body.category, "category");
                if(!validationResult.validation) return validationResult;
                break;

            case "price":
                validationResult = validateString(body.price, "price");
                if(!validationResult.validation) return validationResult;
                break;

            case "stock":
                validationResult = validateString(body.stock, "stock");
                if(!validationResult.validation) return validationResult;
                break;

            case "supplier":
                validationResult = validateString(body.supplier, "supplier");
                if(!validationResult.validation) return validationResult;
                break;

            default:
                return {
                    validation: false,
                    message: 'Body has a non allowed property called ${propert}'
                };
        }
    }

    return {
        validation: true,
        message: "all validation passed"
    };
}

function validateString(value, field) {
    return {
        validation: typeof value === "string",
        message: '${field} is invalid'
    };
}

function validatePositiveNUmber(value, field) {
    return {
        validation: typeof value === "number" && value > 0,
        message: '${field} is invalid'
    };
}

function validateStock(stock) {
    return {
        validation: Number.isInteger(stock) && stock >= 0,
        message: "stock is invalid"
    };
}

export function validateCheckoutBody(body) {
    if(!body || !Array.isArray(body.products) || body.products.length === 0) {
        return {
            validation: false,
            message: "products must be a non empty array"
        };
    }

    for(const product of body.products) {
        if (
            typeof product.id !== "string" ||
            !Number.isInteger(product.quantity) ||
            product.quantity <= 0
        ) {
            return {
                validation: false,
                message: "checkout product information is invalid"
            };
        }
    }

    return {
        validation: true,
        message: "all validation passed"
    };
}