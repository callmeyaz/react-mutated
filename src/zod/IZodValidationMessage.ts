import { IValidationMessage } from "form-runner";

/**
 * Yup validation error message
 */
export interface IZodValidationMessage extends IValidationMessage, Record<string, unknown> {
  errorCode: string
}