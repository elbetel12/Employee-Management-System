"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const errorHandler_1 = require("./errorHandler");
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            const message = result.error.errors
                .map((e) => `${e.path.join('.')}: ${e.message}`)
                .join('; ');
            return next(new errorHandler_1.AppError(message, 422));
        }
        // Replace the raw data with the parsed (coerced) data
        req[target] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map