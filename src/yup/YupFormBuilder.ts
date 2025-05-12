

import { IYupValidationMessage } from "./IYupValidationMessage";
import { AbstractFieldOptions, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import * as Yup from "yup";

export interface IYupSchemaProvider {
  getSchema: () => Yup.Schema;
}

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

  protected buildValidationRules(schema: Yup.Schema, validators: ValidatorFunction<any>[], isRoot: boolean): Yup.Schema {
    for (const validator of validators) {
      schema = schema.test(validator.name, function (value) {
        const newPath = !isRoot ? this.path : `${this.path}._`;
        const ret = validator({ path: newPath, value: value, parent: this.parent } as AbstractFieldOptions<any>);
        if (ret) {
          return this.createError({
            message: {
              key: newPath,
              message: ret.message
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      });
    }
    return schema;
  }
}

export class YupFormField extends YupFormBase implements IFormField<IYupValidationMessage> {
  constructor(public value: Yup.Schema, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var schema = this.value;
    return this.buildValidationRules(schema, this.validators, false);
  }
}

export class YupFormGroup extends YupFormBase implements IFormGroup<IYupValidationMessage> {
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
    return this.buildValidationRules(schema, this.validators, true);
  }
}

export class YupFormArray extends YupFormBase implements IFormArray<IYupValidationMessage> {
  constructor(private child: TArray<IYupValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    const childWithSchema = this.child as unknown as IYupSchemaProvider;
    var schema = Yup.array((childWithSchema).getSchema());
    return this.buildValidationRules(schema, this.validators, true);
  }
}
