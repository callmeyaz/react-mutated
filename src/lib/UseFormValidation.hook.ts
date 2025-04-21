import { useEffect, useRef, useState } from "react";
import { KeyValuePair, MutationTracker } from 'mutation-tracker';
import { IFormValidator } from "./IFormValidator";
import { IValidationErrorMessage } from "./IValidationErrorMessage";
import { FormFieldState } from './FormFieldState';
import { flattenObjectToArray } from './ObjectUpdater';
import { some, filter, forEach } from 'lodash';

export type FormVaidationConfig = {
  initiallyTouched?: string[],
  initiallyDirty?: string[],
}

export function useFormValidation<T extends KeyValuePair>(validator: IFormValidator<IValidationErrorMessage>, dataObject: T, config?: FormVaidationConfig) {
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

  //#region validStateTracker
  const validStateTracker = useRef(MutationTracker<string[], T>(dataObject, {
    defaultValue: []
  }));
  //#endregion

  //#region Field functions

  function getFieldErrors(fieldName: string): string[] {
    return filter(errorList, (item) => item.key == fieldName).map(item => item.message);
  }

  function getFieldValid(fieldName: string): boolean {
    return !!(filter(errorList, item => item.key == fieldName).length);
  }

  function buildFieldState<T>(name: string, currentValue: T, previousValue: T): FormFieldState<T> {
    var fieldErrors = validStateTracker.current.getMutatedByAttributeName(name);
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

  //#endregion

  //#region form functions

  function setIsSubmitting(isSubmitting: boolean): void {
    setSubmitting(isSubmitting);
  }

  function isDirty(): boolean {
    return some(flattenObjectToArray(dirtyStateTracker.current.state, "."), (item) => item.value);
  }

  function isValid(): boolean {
    return !!(errorList.length);
  }

  //#endregion

  const [errorList, setErrorList] = useState<IValidationErrorMessage[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, setIteration] = useState(0);

  function TriggerChange() {
    setIteration(x => x + 1);
  }

  useEffect(() => {
    validate();
  }, [])

  function validate(): boolean {
    var result: boolean = false;
    (
      async () => await validateAsync()
        .then((response) => result = response)
        .catch(() => result = false)
    )();
    return result;
  }

  function validateAsync(): Promise<boolean> {
    return validator.validate(dataObject)
      .then((response) => {
        setErrorList(response);
        var groups = Object.groupBy(response, ({ key }) => key)
        validStateTracker.current.clear();
        forEach(groups, (group, key) => {
          var messages = group?.map(x => x.message) || [];
          validStateTracker.current.setMutatedByAttributeName(messages, key);
        });
        return isValid();
      });
  }

  return {
    errorList: errorList,
    errors: validStateTracker.current.state,
    touched: touchedStateTracker.current.state,
    dirty: dirtyStateTracker.current.state,
    isSubmitting: submitting,
    isDirty: isDirty,
    isValid: isValid,
    validateAsync: validateAsync,
    validate: validate,
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
