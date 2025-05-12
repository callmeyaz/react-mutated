import { FormStateConfig } from "form-runner";
import { KeyValuePair, useFormRunner } from "react-form-runner";
import { JoiValidator } from "./JoiValidator";
import { IJoiValidationMessage } from "./IJoiValidationMessage";
import { IFormGroup } from "../lib/FormBuilder";
import { JoiFormBuilder } from "./JoiFormBuilder";

export function useJoiFormBuilder<T extends KeyValuePair>(
  buildValidation: (builder: JoiFormBuilder) => IFormGroup<IJoiValidationMessage>,
  dataObject: T,
  config?: FormStateConfig) {

  const formBuilder = new JoiFormBuilder();
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
  } = useFormRunner(new JoiValidator(validationSchema), dataObject, config);


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
