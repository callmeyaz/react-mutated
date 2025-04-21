import * as Yup from "yup";
import { IFormValidator } from "../lib/types/IFormValidator";
import { IYupValidationErrorMessage } from "./IYupValidationErrorMessage";

/**
 * Yup validation
 */
export class YupValidator<T extends Yup.Maybe<Yup.AnyObject>> implements IFormValidator<IYupValidationErrorMessage> {
    
    constructor(private validationSchema: Yup.ObjectSchema<T>) { }

    public validate(data: T): Promise<IYupValidationErrorMessage[]> {
        return this.validationSchema.validate(data, { abortEarly: false })
            .then((_) => [])
            .catch((err) => {
                return err.errors as IYupValidationErrorMessage[];
            });
    }
}