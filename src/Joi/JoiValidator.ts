import { IFormArray, IFormField, IFormGroup } from "../lib/FormBuilder";
import { IJoiValidationMessage } from "./IJoiValidationMessage";

export class JoiValidator {
  constructor(private config: IFormField<IJoiValidationMessage> | IFormGroup<IJoiValidationMessage> | IFormArray<IJoiValidationMessage>) {
  }

  public validate(data: any): Promise<IJoiValidationMessage[]> {
    return this.config.validate(data)
      .then((errors) => {
        return errors;
      })
  }
}