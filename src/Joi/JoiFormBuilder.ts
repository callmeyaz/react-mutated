

import { IJoiValidationMessage } from "./IJoiValidationMessage";
import { AbstractFieldOptions, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import * as Joi from "joi";

export interface IJoiSchemaProvider {
  getSchema: () => Joi.Schema;
}

export class JoiFormBuilder implements IFormBuilder<IJoiValidationMessage> {
  public field(field: TField<IJoiValidationMessage>, validators: ValidatorFunction<any>[]): JoiFormField {
    return new JoiFormField(field.value, validators);
  }

  public group(fields: TGroup<IJoiValidationMessage>, validators: ValidatorFunction<any>[] = []): JoiFormGroup {
    return new JoiFormGroup(fields, validators);
  }

  public array(fields: TArray<IJoiValidationMessage>, validators: ValidatorFunction<any>[] = []): JoiFormArray {
    return new JoiFormArray(fields, validators);
  }
}

abstract class JoiFormBase implements IValidatable<IJoiValidationMessage>, IJoiSchemaProvider {
  public abstract getSchema(): Joi.Schema;

  public validate(obj: any): Promise<IJoiValidationMessage[]> {
    return this.getSchema().validate(obj, { abortEarly: false })
      .then((_) => {
        return [];
      })
      .catch((err) => {
        return err.errors as IJoiValidationMessage[];
      });
  }

  protected buildValidationRules(schema: Joi.Schema, validators: ValidatorFunction<any>[], isRoot: boolean): Joi.Schema {
    for (const validator of validators) {
      schema = schema.test(validator.name, function (value) {
        const newPath = !isRoot ? this.path : `${this.path}._`;
        const ret = validator({ path: newPath, value: value, parent: this.parent } as AbstractFieldOptions<any>);
        if (ret) {
          return this.createError({
            message: {
              key: newPath,
              message: ret.message
            } as Joi.Message<IJoiValidationMessage>
          });
        }
        return true;
      });
    }
    return schema;
  }
}

export class JoiFormField extends JoiFormBase implements IFormField<IJoiValidationMessage> {
  constructor(public value: Joi.Schema, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Joi.Schema {
    var schema = this.value;
    return this.buildValidationRules(schema, this.validators, false);
  }
}

export class JoiFormGroup extends JoiFormBase implements IFormGroup<IJoiValidationMessage> {
  constructor(private children: TGroup<IJoiValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Joi.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey];
      const childWithSchema = child as unknown as IJoiSchemaProvider;
      obj = { ...obj, [childKey]: childWithSchema.getSchema() };
    });
    var schema = Joi.object().shape(obj);
    return this.buildValidationRules(schema, this.validators, true);
  }
}

export class JoiFormArray extends JoiFormBase implements IFormArray<IJoiValidationMessage> {
  constructor(private child: TArray<IJoiValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Joi.Schema {
    const childWithSchema = this.child as unknown as IJoiSchemaProvider;
    var schema = Joi.array((childWithSchema).getSchema());
    return this.buildValidationRules(schema, this.validators, true);
  }
}
