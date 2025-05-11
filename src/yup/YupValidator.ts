import * as Yup from "yup";
import { IYupValidationMessage } from "./IYupValidationErrorMessage";
import { YupFormBuilder, YupFormField, IFormGroup, YupFormGroup } from "../lib/DataTypes";
import { atleastOneItemValidator, minLengthValidator, requiredValidator } from "../lib/ValidatorFunctions";

/**
 * Yup validation
 */
export class YupValidator {
  private builder: YupFormBuilder;
  formGroup: IFormGroup<IYupValidationMessage>;

  constructor() {
    this.builder = new YupFormBuilder();

    this.formGroup = this.builder.group({
      name: this.builder.group({
        firstname: new YupFormField(Yup.string().defined(), [requiredValidator(), minLengthValidator(4)]),
        lastname: new YupFormField(Yup.string().defined(), [requiredValidator()]),
      }, []),
      roles: this.builder.array(new YupFormField(Yup.string().defined(), [requiredValidator()]), [atleastOneItemValidator()]),
      address: new YupFormField(Yup.string().defined(), [requiredValidator()])
    }, []);
  }

  public validate(data: any): Promise<IYupValidationMessage[]> {
    console.log("Validating data", data);
    return this.formGroup.validate(data)
      .then((errors) => {
        console.log("Validation errors", errors);
        return errors;
      })
  }
}