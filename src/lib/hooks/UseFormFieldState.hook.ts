import { useState } from "react";
import { useStateTrackers } from "./UseStateTrackers.hook";
import { FormVaidationConfig } from "../types/FormVaidationConfig";
import { FormFieldState } from "../types/FormFieldState";
import { forEach, some } from "lodash";
import { IValidationErrorMessage } from "../types/IValidationErrorMessage";
import { flattenObjectToArray } from "../Utils";

export function useFormFieldState<T extends { [field: string]: any }>(dataObject: T, config?: FormVaidationConfig) {
  const [errorFlatList, setErrorFlatList] = useState<IValidationErrorMessage[]>([]);
  const { touchedStateTracker, dirtyStateTracker, errorStateTracker: validStateTracker } = useStateTrackers(dataObject, config);
  const [, setIteration] = useState(0);

  function TriggerChange() {
    setIteration(x => x + 1);
  }
  //#region touched functions
  function getFieldTouched(fieldName: string): boolean {
    return touchedStateTracker.getMutatedByAttributeName(fieldName);
  }

  function setFieldTouched(value: boolean, fieldName: string) {
    touchedStateTracker.setMutatedByAttributeName(value, fieldName);
    TriggerChange();
  }

  function setFieldsTouched(value: boolean, fieldNames: string[]) {
    touchedStateTracker.setMutatedByAttributeNames(value, fieldNames);
    TriggerChange();
  }

  function setTouchedAll(value: boolean) {
    touchedStateTracker.setAll(value);
    TriggerChange();
  }
  //#endregion

  //#region dirty functions
  function getFieldDirty(fieldName: string): boolean {
    return dirtyStateTracker.getMutatedByAttributeName(fieldName);
  }

  function setFieldDirty(value: boolean, fieldName: string) {
    dirtyStateTracker.setMutatedByAttributeName(value, fieldName);
    TriggerChange();
  }

  function setFieldsDirty(value: boolean, fieldNames: string[]) {
    dirtyStateTracker.setMutatedByAttributeNames(value, fieldNames);
    TriggerChange();
  }

  function setDirtyAll(value: boolean) {
    dirtyStateTracker.setAll(value);
    TriggerChange();
  }
  //#endregion

  //#region error functions
  function getFieldErrors(fieldName: string): string[] {
    return validStateTracker.getMutatedByAttributeName(fieldName).map(item => item);
  }
  //#endregion

  //#region validation functions
  function getFieldValid(fieldName: string): boolean {
    return (validStateTracker.getMutatedByAttributeName(fieldName).length ?? 0) <= 0;
  }

  function setErrorsAll(errors: IValidationErrorMessage[]) {
    setErrorFlatList(errors);
    validStateTracker.clear();
    var groups = Object.groupBy(errors, ({ key }) => key)
    forEach(groups, (group, key) => {
      var messages = group?.map(x => x.message) || [];
      validStateTracker.setMutatedByAttributeName(messages, key);
    });
  }
  //#endregion

  function isFormDirty(): boolean {
    console.log("isdirty", flattenObjectToArray(dirtyStateTracker.state, "."), some(flattenObjectToArray(dirtyStateTracker.state, "."), (item) => item.value));

    return some(flattenObjectToArray(dirtyStateTracker.state, "."), (item) => item.value);
  }

  function isFormValid(): boolean {
    return !(errorFlatList.length);
  }

  function getFieldState<T>(name: string, currentValue: T, previousValue: T): FormFieldState<T> {
    var fieldErrors = validStateTracker.getMutatedByAttributeName(name);
    return {
      name: name,
      currentValue: currentValue,
      previousValue: previousValue,
      touched: touchedStateTracker.getMutatedByAttributeName(name),
      dirty: dirtyStateTracker.getMutatedByAttributeName(name),
      isValid: !!(fieldErrors.length),
      errors: fieldErrors,
    };
  }

  return {
    errorFlatList: errorFlatList,
    errors: validStateTracker.state,
    touched: touchedStateTracker.state,
    dirty: dirtyStateTracker.state,
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
    getFieldErrors: getFieldErrors,
    setErrorsAll: setErrorsAll,
    isFormDirty: isFormDirty,
    isFormValid: isFormValid
  }

}