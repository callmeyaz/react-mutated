
import { IValidationMessage } from "react-form-runner";
import { ValidatorFunction } from "./ValidatorFunction";

export interface IValidatable<E extends IValidationMessage> {
  validate: (obj: any) => Promise<E[]>;
}

export interface IFormField<E extends IValidationMessage> extends IValidatable<E> {
  validators: ValidatorFunction<any>[];
}

export interface IFormGroup<E extends IValidationMessage> extends IValidatable<E> {
  validators: ValidatorFunction<any>[];
}

export interface IFormArray<E extends IValidationMessage> extends IValidatable<E> {
  validators: ValidatorFunction<any>[];
}

export type TField<E extends IValidationMessage> = IFormField<E>;
export type TGroup<E extends IValidationMessage> = { [key: string]: (IFormField<E> | IFormGroup<E> | IFormArray<E>) };
export type TArray<E extends IValidationMessage> = (IFormField<E> | TGroup<E>);

export interface IFormBuilder<E extends IValidationMessage> {
  field: (validators: ValidatorFunction<any>[]) => IFormField<E>;
  group: <TVal extends TGroup<E>>(fields: TVal, validators: ValidatorFunction<any>[]) => IFormGroup<E>;
  array: <TVal extends TArray<E>>(fields: TVal, validators: ValidatorFunction<any>[]) => IFormArray<E>;
}