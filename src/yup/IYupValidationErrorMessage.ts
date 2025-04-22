import { IValidationErrorMessage } from "react-mable";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationErrorMessage, Record<string, unknown> {
    errorCode: string
}