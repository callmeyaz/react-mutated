

import { IValidationMessage } from "form-runner";
import { IYupValidationMessage } from "../yup/IYupValidationErrorMessage";
import { AbstractControl, ValidatorFunction } from "./ValidatorFunctions";
import * as Yup from "yup";


export interface IValidatable<E extends IValidationMessage> {
  validate: (obj: any) => Promise<E[]>;
}

export interface IFormField<E extends IValidationMessage> extends IValidatable<E> {
  value: any;
  validators: ValidatorFunction<any>[];
}

export interface IFormGroup<E extends IValidationMessage> extends IValidatable<E> {
  validators: ValidatorFunction<any>[];
}

export interface IFormArray<E extends IValidationMessage> extends IValidatable<E> {
  validators: ValidatorFunction<any>[];
}

export type TGroup<E extends IValidationMessage> = { [key: string]: (IFormField<E> | IFormGroup<E> | IFormArray<E>) };
export type TArray<E extends IValidationMessage> = (IFormField<E> | TGroup<E>);

export interface IFormBuilder<E extends IValidationMessage> {
  group: <TVal extends TGroup<E>>(fields: TVal, validators: ValidatorFunction<any>[]) => IFormGroup<E>;
  array: <TVal extends TArray<E>>(fields: TVal, validators: ValidatorFunction<any>[]) => IFormArray<E>;
}

//- Yup

export interface IYupSchemaProvider {
  getSchema: () => Yup.Schema;
}

export class YupFormBuilder implements IFormBuilder<IYupValidationMessage> {
  public group(fields: TGroup<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): IFormGroup<IYupValidationMessage> {
    return new YupFormGroup(fields, validators);
  }

  public array(fields: TArray<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): IFormArray<IYupValidationMessage> {
    return new YupFormArray(fields, validators);
  }
}

export class YupFormField implements IFormField<IYupValidationMessage>, IYupSchemaProvider {
  constructor(public value: Yup.Schema, public validators: ValidatorFunction<any>[] = []) {
  }

  public getSchema(): Yup.Schema {
    var schema = this.value;

    for (const validator of this.validators) {
      schema = schema.test("name", function (value) {
        var ret = validator({ path: this.path, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: "0001"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }

  public validate(obj: any): Promise<IYupValidationMessage[]> {
    return this.getSchema().validate(obj, { abortEarly: false })
      .then((_) => {
        return [];
      })
      .catch((err) => {
        return err.errors as IYupValidationMessage[];
      });
  }
}

export class YupFormGroup implements IFormGroup<IYupValidationMessage>, IYupSchemaProvider {

  constructor(private children: TGroup<IYupValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
  }

  public getSchema(): Yup.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey] as unknown as IYupSchemaProvider;
      obj = { ...obj, [childKey]: child.getSchema() };
    });
    var schema = Yup.object().shape(obj);

    for (const validator of this.validators) {
      schema = schema.test("name", function (value) {
        var ret = validator({ path: this.path, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: "0001"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }

  public validate(obj: any): Promise<IYupValidationMessage[]> {
    return this.getSchema().validate(obj, { abortEarly: false })
      .then((_) => {
        return [];
      })
      .catch((err) => {
        return err.errors as IYupValidationMessage[];
      });
  }
}

export class YupFormArray implements IFormArray<IYupValidationMessage>, IYupSchemaProvider {

  constructor(private child: TArray<IYupValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
  }

  public getSchema(): Yup.Schema {
    var schema = Yup.array((this.child as unknown as IYupSchemaProvider).getSchema());

    for (const validator of this.validators) {
      schema = schema.test("name", function (value) {
        var ret = validator({ path: this.path, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: "0001"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }

  public validate(obj: any): Promise<IYupValidationMessage[]> {
    return this.getSchema().validate(obj, { abortEarly: false })
      .then((_) => {
        return [];
      })
      .catch((err) => {
        return err.errors as IYupValidationMessage[];
      });
  }
}