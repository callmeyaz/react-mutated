import { IZodValidationMessage } from "./IZodValidationMessage";
import { IFormArray, IFormField, IFormGroup } from "../lib/FormBuilder";

export class ZodValidator {
  constructor(private config: IFormField<IZodValidationMessage> | IFormGroup<IZodValidationMessage> | IFormArray<IZodValidationMessage>) {
  }

  public validate(data: any): Promise<IZodValidationMessage[]> {
    return this.config.validate(data)
      .then((errors) => {
        return errors;
      })
  }
}