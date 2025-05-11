

import { IYupValidationMessage } from "./IYupValidationMessage";
import { AbstractFieldOptions, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormBuilder, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import * as Yup from "yup";

export interface IYupSchemaProvider {
  getSchema: () => Yup.Schema;
}

// export interface YTField<E extends IYupValidationMessage>  extends TFormField<E> {}
// export interface YTGroup<E extends IYupValidationMessage> extends TGroup<E> {}
// export interface YTArray<E extends IYupValidationMessage> extends TArray<E> {}

export class YupFormBuilder implements IFormBuilder<IYupValidationMessage> {
  public field(field: TField<IYupValidationMessage>, validators: ValidatorFunction<any>[]): YupFormField {
    return new YupFormField(field.value, validators);
  }

  public group(fields: TGroup<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): YupFormGroup {
    return new YupFormGroup(fields, validators);
  }

  public array(fields: TArray<IYupValidationMessage>, validators: ValidatorFunction<any>[] = []): YupFormArray {
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
        var ret = validator({ path: this.path, value: value, parent: this.parent } as AbstractFieldOptions<any>);
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
      const child = this.children[childKey];
      const childWithSchema = child as unknown as IYupSchemaProvider;
      obj = { ...obj, [childKey]: childWithSchema.getSchema() };
    });
    var schema = Yup.object().shape(obj);

    for (const validator of this.validators) {
      schema = schema.test(validator.name, function (value) {
        var ret = validator({ path: getRootPath(this.path), value: value, parent: this.parent } as AbstractFieldOptions<any>);
        if (ret) {
          return this.createError({
            message: {
              key: getRootPath(this.path),
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
    const childWithSchema = this.child as unknown as IYupSchemaProvider;
    var schema = Yup.array((childWithSchema).getSchema());

    for (const validator of this.validators) {
      schema = schema.test(validator.name, function (value) {
        var ret = validator({ path: getRootPath(this.path), value: value, parent: this.parent } as AbstractFieldOptions<any>);
        if (ret) {
          return this.createError({
            message: {
              key: getRootPath(this.path),
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

function getRootPath(path: string): string {
  return `${path}._`;
}
