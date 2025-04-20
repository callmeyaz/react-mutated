import * as _ from 'lodash';
import { useEffect, useRef, useState } from "react";
import { KeyValuePair, MutationTracker } from 'mutation-tracker';
import { IFormValidator } from "./IFormValidator";
import { IValidationErrorMessage } from "./IValidationErrorMessage";
import { FormFieldState } from './FormFieldState';
import { flattenObjectToArray } from './ObjectUpdater';
import { some } from 'lodash';

export type FormVaidationConfig = {
  initiallyTouched?: string[],
  initiallyDirty?: string[],
}

export function useFormValidation<T extends KeyValuePair>(validator: IFormValidator<IValidationErrorMessage>, dataObject: T, config?: FormVaidationConfig) {
  const [errors, setErrors] = useState<IValidationErrorMessage[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, setIteration] = useState(0);

  //#region touchedStateTracker
  const touchedStateTracker = useRef(MutationTracker(dataObject, {
    defaultValue: false,
    initialMutation: {
      mutatedAttributes: config?.initiallyTouched,
      mutatedValue: true
    }
  }));

  function getFieldTouched(fieldName: string): boolean {
    return touchedStateTracker.current.getMutatedByAttributeName(fieldName);
  }

  function setFieldTouched(value: boolean, fieldName: string) {
    touchedStateTracker.current.setMutatedByAttributeName(value, fieldName);
    TriggerChange();
  }

  function setFieldsTouched(value: boolean, fieldNames: string[]) {
    touchedStateTracker.current.setMutatedByAttributeNames(value, fieldNames);
    TriggerChange();
  }

  function setTouchedAll(value: boolean) {
    touchedStateTracker.current.setAll(value);
    TriggerChange();
  }
  //#endregion

  //#region dirtyStateTracker
  const dirtyStateTracker = useRef(MutationTracker(dataObject, {
    defaultValue: false,
    initialMutation: {
      mutatedAttributes: config?.initiallyDirty,
      mutatedValue: true
    }
  }));

  function getFieldDirty(fieldName: string): boolean {
    return dirtyStateTracker.current.getMutatedByAttributeName(fieldName);
  }

  function setFieldDirty(value: boolean, fieldName: string) {
    dirtyStateTracker.current.setMutatedByAttributeName(value, fieldName);
    TriggerChange();
  }

  function setFieldsDirty(value: boolean, fieldNames: string[]) {
    dirtyStateTracker.current.setMutatedByAttributeNames(value, fieldNames);
    TriggerChange();
  }

  function setDirtyAll(value: boolean) {
    dirtyStateTracker.current.setAll(value);
    TriggerChange();
  }

  //#endregion

  //#region
  function setIsSubmitting(isSubmitting: boolean): void {
    setSubmitting(isSubmitting);
  }

  function getFieldErrors(fieldName: string): IValidationErrorMessage[] {
    return _.filter(errors, (item) => item.key == fieldName);
  }

  function getFieldValid(fieldName: string): boolean {
    return !!(_.filter(errors, (item) => item.key == fieldName).length);
  }

  function isDirty(): boolean {
    return some(flattenObjectToArray(dirtyStateTracker.current.state, "."), (item) => item.value );
  }

  function isValid(): boolean {
    return !!(errors.length);
  }

  //#endregion


  function TriggerChange() {
    setIteration(x => x + 1);
  }

  useEffect(() => {
    runValidation();
  }, [])

  function runValidation() {
    console.log("validating... ", dataObject)
    validator.validate(dataObject)
      .then((response) => {
        setErrors(response);
      });
  }

  function buildFieldState<T>(name: string, currentValue: T, previousValue: T): FormFieldState<T, IValidationErrorMessage> {
    var fieldErrors = errors.filter((item) => item.key === name);
    return {
      name: name,
      currentValue: currentValue,
      previousValue: previousValue,
      touched: touchedStateTracker.current.getMutatedByAttributeName(name),
      dirty: dirtyStateTracker.current.getMutatedByAttributeName(name),
      isValid: !!(fieldErrors.length),
      errors: fieldErrors,
    };
  }

  return {
    errors: errors,
    touched: touchedStateTracker.current.state,
    dirty: dirtyStateTracker.current.state,
    isSubmitting: submitting,
    isDirty: isDirty,
    isValid: isValid,
    validate: runValidation,
    setIsSubmitting: setIsSubmitting,
    getFieldState: buildFieldState,
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
}
