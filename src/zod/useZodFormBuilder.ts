import { FormStateConfig } from "form-runner";
import { KeyValuePair, useFormRunner } from "react-form-runner";
import { ZodValidator } from "./ZodValidator";
import { IZodValidationMessage } from "./IZodValidationMessage";
import { IFormGroup } from "../lib/FormBuilder";
import { ZodFormBuilder } from "./ZodFormBuilder";

export function useZodFormBuilder<T extends KeyValuePair>(
  buildValidation: (builder: ZodFormBuilder) => IFormGroup<IZodValidationMessage>,
  dataObject: T,
  config?: FormStateConfig) {

  const formBuilder = new ZodFormBuilder();
  var validationSchema = buildValidation(formBuilder);

  const {
    errors,
    touched,
    dirty,
    isSubmitting,
    errorFlatList,
    validate,
    validateAsync,
    setIsSubmitting,
    isFormDirty,
    isFormTouched,
    isFormValid,
    getFieldState,
    getFieldTouched,
    setFieldTouched,
    setFieldsTouched,
    setTouchedAll,
    getFieldDirty,
    setFieldDirty,
    setFieldsDirty,
    setDirtyAll,
    getFieldValid,
    getFieldErrors
  } = useFormRunner(new ZodValidator(validationSchema), dataObject, config);


  return {
    errorFlatList: errorFlatList,
    errors: errors,
    touched: touched,
    dirty: dirty,
    isSubmitting: isSubmitting,
    isFormDirty: isFormDirty,
    isFormTouched: isFormTouched,
    isFormValid: isFormValid,
    validateAsync: validateAsync,
    validate: validate,
    setIsSubmitting: setIsSubmitting,
    getFieldState: getFieldState,
    getFieldTouched: getFieldTouched,
    setFieldTouched: setFieldTouched,
    setFieldsTouched: setFieldsTouched,
    setTouchedAll: setTouchedAll,
    getFieldDirty: getFieldDirty,
    setFieldDirty: setFieldDirty,
    setFieldsDirty: setFieldsDirty,
    setDirtyAll: setDirtyAll,
    getFieldValid: getFieldValid,
    getFieldErrors: getFieldErrors
  }
};
