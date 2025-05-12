import { FormStateConfig } from "form-runner";
import { KeyValuePair, useFormRunner } from "react-form-runner";
import { YupValidator } from "./YupValidator";
import { IYupValidationMessage } from "./IYupValidationMessage";
import { IFormGroup } from "../lib/FormBuilder";
import { YupFormBuilder } from "./YupFormBuilder";

export function useYupFormBuilder<T extends KeyValuePair>(
  buildValidation: (builder: YupFormBuilder) => IFormGroup<IYupValidationMessage>,
  dataObject: T,
  config?: FormStateConfig) {

  const formBuilder = new YupFormBuilder();
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
  } = useFormRunner(new YupValidator(validationSchema), dataObject, config);


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
