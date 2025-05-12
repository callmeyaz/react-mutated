import { IValidationMessage } from "form-runner";

/**
 * Zod validation error message
 */
export interface IZodValidationMessage extends IValidationMessage, Record<string, unknown> {
}