import { IValidationMessage } from "form-runner";

/**
 * Joi validation error message
 */
export interface IJoiValidationMessage extends IValidationMessage, Record<string, unknown> {
}