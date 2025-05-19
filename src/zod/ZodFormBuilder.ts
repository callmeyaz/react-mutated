

import { IZodValidationMessage } from "./IZodValidationMessage";
import { ValidatorFunction } from "../lib/ValidatorFunction";
import { IFormArray, IFormBuilder, IFormField, IFormGroup, IValidatable, TArray, TField, TGroup } from "../lib/FormBuilder";
import { z as Zod, ZodError } from "zod";

export interface IZodSchemaProvider {
  getSchema: (data: any) => Zod.Schema;
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
  public abstract getSchema(data: any): Zod.Schema;

  public validate(data: any): Promise<IZodValidationMessage[]> {
    try {
      this.getSchema(data).parse(data);
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

  protected buildValidationRules(schema: Zod.Schema, data: any, validators: ValidatorFunction<any>[], isRoot: boolean): Zod.Schema {
    var self = this;

    schema = schema.superRefine(function (value: any, ctx: Zod.RefinementCtx) {
      const appendPath = !isRoot ? [] : ['_'];
      const pathString = self.fromPath(ctx.path.concat(appendPath));
      for (const validator of validators) {
        const ret = validator({ path: pathString, value: value, parent: data });
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

  public getSchema(data: any): Zod.Schema {
    var schema = this.value;
    return this.buildValidationRules(schema, data, this.validators, false);
  }
}

export class ZodFormGroup extends ZodFormBase implements IFormGroup<IZodValidationMessage> {
  constructor(private children: TGroup<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(data: any): Zod.Schema {
    var obj = {};
    Object.keys(this.children).forEach(childKey => {
      const child = this.children[childKey];
      const childWithSchema = child as unknown as IZodSchemaProvider;
      obj = { ...obj, [childKey]: childWithSchema.getSchema(data) };
    });
    var schema = Zod.object(obj);
    return this.buildValidationRules(schema, data, this.validators, true);
  }
}

export class ZodFormArray extends ZodFormBase implements IFormArray<IZodValidationMessage> {
  constructor(private child: TArray<IZodValidationMessage>, public validators: ValidatorFunction<any>[] = []) {
    super();
  }

  public getSchema(data: any): Zod.Schema {
    const childWithSchema = this.child as unknown as IZodSchemaProvider;
    var schema = Zod.array((childWithSchema).getSchema(data));
    return this.buildValidationRules(schema, data, this.validators, true);
  }
}
