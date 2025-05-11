import { IValidationMessage } from "form-runner";

/**
 * Yup validation error message
 */
export interface IYupValidationMessage extends IValidationMessage, Record<string, unknown> {
  errorCode: string
}