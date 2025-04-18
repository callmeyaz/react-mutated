import * as _ from 'lodash';
import { useRef, useState } from "react";
import { KeyValuePair, MutationTracker } from 'mutation-tracker';
import { IFormValidator } from "./IFormValidator";
import { IValidationErrorMessage } from "./IValidationErrorMessage";
import { FormFieldState } from './FormFieldState';

export function useFormValidation<T extends KeyValuePair>(validator: IFormValidator<IValidationErrorMessage>, dataObject: T, initialyTouched?: string[]) {
    const stateTracker = useRef(MutationTracker(dataObject, { initiallyMutatedAttributes: initialyTouched }));
    const [errors, setErrors] = useState<IValidationErrorMessage[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [, setIteration] = useState(0);

    function runValidation() {
        validator.validate(dataObject)
            .then((response) => {
                setErrors(response);
            });
    }

    function setIsSubmitting(isSubmitting: boolean): void {
        setSubmitting(isSubmitting);
    }

    function buildFieldState<T>(name: string, currentValue: T, previousValue: T): FormFieldState<T, IValidationErrorMessage> {
        return {
            name: name,
            currentValue: currentValue,
            previousValue: previousValue,
            isFieldTouched: stateTracker.current.getMutatedByAttributeName(name),
            fieldError: errors.find((item) => item.key === name) || null,
        };
    }

    function TriggerChange() {
        setIteration(x => x + 1);
    }

    function setMutatedByAttributeName(value: boolean, attributeName: string) {
        stateTracker.current.setMutatedByAttributeName(value, attributeName);
        TriggerChange();
    }

    function setMutatedByAttributeNames(value: boolean, attributeNames: string[]) {
        stateTracker.current.setMutatedByAttributeNames(value, attributeNames);
        TriggerChange();
    }

    function setAll(value: boolean) {
        stateTracker.current.setAll(value);
        TriggerChange();
    }

    return {
        errors: errors,
        touched: stateTracker.current.state,
        isSubmitting: submitting,
        runValidation: runValidation,
        setIsSubmitting: setIsSubmitting,
        getFieldState: buildFieldState,
        getFieldTouched: stateTracker.current.getMutatedByAttributeName,
        setFieldTouched: setMutatedByAttributeName,
        setFieldsTouched: setMutatedByAttributeNames,
        touchedAll: setAll
    }
}
