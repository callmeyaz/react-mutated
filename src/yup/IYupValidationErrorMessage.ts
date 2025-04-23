import { IValidationErrorMessage } from "react-mabel";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationErrorMessage, Record<string, unknown> {
    errorCode: string
}