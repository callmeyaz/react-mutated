

import { IZodValidationMessage } from "./IZodValidationMessage";
import { AbstractFieldOptions, ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import { toPath } from "lodash-es";
import { z as Zod, ZodError } from "zod";

export interface IZodSchemaProvider {
  getSchema: () => Zod.Schema;
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
  public abstract getSchema(): Zod.Schema;

  public validate(obj: any): Promise<IZodValidationMessage[]> {

    try {
      this.getSchema().parse(obj);
    }
    catch (errors) {
      if (errors instanceof ZodError) {
        const errorList = (errors as ZodError).issues as Zod.ZodCustomIssue[];
        const result = errorList.map(err => err.params as IZodValidationMessage);
        return Promise.resolve(result);
      }
    }
    return Promise.resolve([]);
  }

  protected buildValidationRules(schema: Zod.Schema, validators: ValidatorFunction<any>[], isRoot: boolean): Zod.Schema {
    var self = this;

    schema = schema.superRefine(function (value: any, ctx: Zod.RefinementCtx) {
      const appendPath = !isRoot ? [] : ['_'];
      const pathString = self.fromPath(ctx.path.concat(appendPath));
      for (const validator of validators) {
        const ret = validator({ path: pathString, value: value } as AbstractFieldOptions<any>);
        if (ret) {
          ctx.addIssue({
            path: appendPath,
            code: Zod.ZodIssueCode.custom,
            params: {
              key: pathString,
              message: ret.message
            } as IZodValidationMessage
          } as Zod.ZodCustomIssue);
        }
      }
    });

    return schema;
  }

  private fromPath(pathArray: (string | number)[]): string {
    return pathArray.reduce((result, key) => {
      if (/^\d+$/.test(`${key}`)) {
        return result + `[${key}]`;
      } else if (result === '') {
        return key;
      } else {
        return result + `.${key}`;
      }
    }, '') as string;
  }
}

export class ZodFormField extends ZodFormBase implements IFormField<IZodValidationMessage> {
  constructor(public value: Zod.Schema, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Zod.Schema {
    var schema = this.value;
    return this.buildValidationRules(schema, this.validators, false);
  }
}

export class ZodFormGroup extends ZodFormBase implements IFormGroup<IZodValidationMessage> {
  constructor(private children: TGroup<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Zod.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey];
      const childWithSchema = child as unknown as IZodSchemaProvider;
      obj = { ...obj, [childKey]: childWithSchema.getSchema() };
    });
    var schema = Zod.object(obj);
    return this.buildValidationRules(schema, this.validators, true);
  }
}

export class ZodFormArray extends ZodFormBase implements IFormArray<IZodValidationMessage> {
  constructor(private child: TArray<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(): Zod.Schema {
    const childWithSchema = this.child as unknown as IZodSchemaProvider;
    var schema = Zod.array((childWithSchema).getSchema());
    return this.buildValidationRules(schema, this.validators, true);
  }
}
