import { IYupValidationMessage } from "./IYupValidationMessage";
import { IFormArray, IFormField, IFormGroup } from "../lib/FormBuilder";

export class YupValidator {
  constructor(private config: IFormField<IYupValidationMessage> | IFormGroup<IYupValidationMessage> | IFormArray<IYupValidationMessage>) {
  }

  public validate(data: any): Promise<IYupValidationMessage[]> {
    console.log("Validating data", data);
    return this.config.validate(data)
      .then((errors) => {
        console.log("Validation errors", errors);
        return errors;
      })
  }
}