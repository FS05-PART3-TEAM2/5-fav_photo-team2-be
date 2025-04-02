"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
function formatZodError(error) {
    const messages = [];
    for (const [field, errors] of Object.entries(error.fieldErrors)) {
        if (errors && errors.length > 0) {
            messages.push(`${field}: ${errors.join(", ")}`);
        }
    }
    if (error.formErrors.length > 0) {
        messages.push(`form: ${error.formErrors.join(", ")}`);
    }
    return messages.join("; ");
}
