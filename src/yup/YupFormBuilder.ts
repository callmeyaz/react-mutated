

import { IYupValidationMessage } from "./IYupValidationMessage";
import { AbstractControl, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TGroup } from "../lib/FormBuilder";
import * as Yup from "yup";

export interface IYupSchemaProvider {
  getSchema: () => Yup.Schema;
}

export class YupFormBuilder implements IFormBuilder<IYupValidationMessage> {
  public field(field: IFormField<IYupValidationMessage>, validators: ValidatorFunction<any>[]): IFormField<IYupValidationMessage> {
    return new YupFormField(field.value, validators);
  }

  public group(fields: TGroup<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): IFormGroup<IYupValidationMessage> {
    return new YupFormGroup(fields, validators);
  }

  public array(fields: TArray<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): IFormArray<IYupValidationMessage> {
    return new YupFormArray(fields, validators);
  }
}

abstract class YupFormBase implements IValidatable<IYupValidationMessage>, IYupSchemaProvider {
  public abstract getSchema(): Yup.Schema;

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

export class YupFormField extends YupFormBase {
  constructor(public value: Yup.Schema, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var schema = this.value;

    for (const validator of this.validators) {
      schema = schema.test(validator.name, function (value) {
        var ret = validator({ path: this.path, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: ret.errorCode
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }
}

export class YupFormGroup extends YupFormBase {
  constructor(private children: TGroup<IYupValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey] as unknown as IYupSchemaProvider;
      obj = { ...obj, [childKey]: child.getSchema() };
    });
    var schema = Yup.object().shape(obj);

    for (const validator of this.validators) {
      schema = schema.test(validator.name, function (value) {
        var ret = validator({ path: `${this.path}.root`, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: ret.errorCode
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }
}

export class YupFormArray extends YupFormBase {
  constructor(private child: TArray<IYupValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var schema = Yup.array((this.child as unknown as IYupSchemaProvider).getSchema());

    for (const validator of this.validators) {
      schema = schema.test(validator.name, function (value) {
        var ret = validator({ path: `${this.path}.root`, value: value, parent: this.parent } as AbstractControl<any>);
        if (ret) {
          return this.createError({
            message: {
              key: this.path,
              message: ret.message,
              errorCode: ret.errorCode
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }

    return schema;
  }
}
