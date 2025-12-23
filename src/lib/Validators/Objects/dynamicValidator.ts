import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../../ValidatorFunction";

export function dynamicValidator<T extends any>(context: any[], validationFn: () => (string | null)): ValidatorFunction<T> {
  console.log(">>>>>>>>>", context);
  return (validator).bind({ args: context });

  function validator(this: any, fieldOptions: AbstractFieldOptions<T>): ValidationResult | null {
    console.log("this", this);
    var result = validationFn.bind(this)();
    if (result != null) {
      return { key: fieldOptions.path, message: result };
    }
    return null;
  }
}