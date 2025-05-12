

import { IZodValidationMessage } from "./IZodValidationMessage";
import { AbstractFieldOptions, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import * as Yup from "yup";

export interface IZodSchemaProvider {
  getSchema: () => Yup.Schema;
}

export class ZodFormBuilder implements IFormBuilder<IZodValidationMessage> {
  public field(field: TField<IZodValidationMessage>, validators: ValidatorFunction<any>[]): ZodFormField {
    return new ZodFormField(field.value, validators);
  }

  public group(fields: TGroup<IZodValidationMessage>, validators: ValidatorFunction<any>[] = []): ZodFormGroup {
    return new ZodFormGroup(fields, validators);
  }

  public array(fields: TArray<IZodValidationMessage>, validators: ValidatorFunction<any>[] = []): ZodFormArray {
    return new ZodFormArray(fields, validators);
  }
}

abstract class ZodFormBase implements IValidatable<IZodValidationMessage>, IZodSchemaProvider {
  public abstract getSchema(): Yup.Schema;

  public validate(obj: any): Promise<IZodValidationMessage[]> {
    return this.getSchema().validate(obj, { abortEarly: false })
      .then((_) => {
        return [];
      })
      .catch((err) => {
        return err.errors as IZodValidationMessage[];
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
            } as Yup.Message<IZodValidationMessage>
          });
        }
        return true;
      });
    }
    return schema;
  }
}

export class ZodFormField extends ZodFormBase implements IFormField<IZodValidationMessage> {
  constructor(public value: Yup.Schema, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var schema = this.value;
    return this.buildValidationRules(schema, this.validators, false);
  }
}

export class ZodFormGroup extends ZodFormBase implements IFormGroup<IZodValidationMessage> {
  constructor(private children: TGroup<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey];
      const childWithSchema = child as unknown as IZodSchemaProvider;
      obj = { ...obj, [childKey]: childWithSchema.getSchema() };
    });
    var schema = Yup.object().shape(obj);
    return this.buildValidationRules(schema, this.validators, true);
  }
}

export class ZodFormArray extends ZodFormBase implements IFormArray<IZodValidationMessage> {
  constructor(private child: TArray<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Yup.Schema {
    const childWithSchema = this.child as unknown as IZodSchemaProvider;
    var schema = Yup.array((childWithSchema).getSchema());
    return this.buildValidationRules(schema, this.validators, true);
  }
}
