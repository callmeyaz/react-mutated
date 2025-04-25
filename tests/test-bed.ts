import { FormRunner, IFormValidator, IValidationMessage } from "form-runner";
import * as Yup from 'yup';

var user = {
    name: {
        firstname: "John",
        lastname: "Doe"
    },
    roles: [
        "contributor",
        ""
    ],
    address: ""
}

interface IYupValidationMessage extends IValidationMessage, Record<string, unknown> {
    errorCode: string
}

class YupValidator<T extends Yup.Maybe<Yup.AnyObject>> implements IFormValidator<IYupValidationMessage> {
    constructor(private validationSchema: Yup.ObjectSchema<T>) { }

	public validate(data: T): Promise<IYupValidationMessage[]> {
        return this.validationSchema.validate(data, { abortEarly: false })
            .then((_) => [])
            .catch((err) => {
                return err.errors as IYupValidationMessage[];
            });
    }
}

// Create Yup validation schema
export const userSchema: Yup.ObjectSchema<typeof user> = Yup.object({
    name: Yup.object({
      firstname: Yup.string().defined().test(function(val) { return !val ?
        this.createError({ 
          message: { key: this.path, message: "First name not provided" } as 
            Yup.Message<IYupValidationMessage> })
        : true 
      }),
      lastname: Yup.string().defined().test(function(val) { return !val ?
        this.createError({ 
          message: { key: this.path, message: "Last name not provided" } as 
            Yup.Message<IYupValidationMessage> })
        : true 
      })
    }),
    roles:  Yup.array().defined().of(
      Yup.string().defined().test(function(val) { return !val ?
        this.createError({ 
          message: { key: this.path, message: "Role not provided" } as 
            Yup.Message<IYupValidationMessage> })
        : true 
      })
    ),
    address: Yup.string().defined().test(function(val) { return !val ?
      this.createError({ 
        message: { key: this.path, message: "Address not provided" } as 
            Yup.Message<IYupValidationMessage> })
      : true 
    })
  });

var validator = new YupValidator(userSchema);
var runner = new FormRunner<typeof user>(validator, user);

console.log("User: ", JSON.stringify(user))
runner.setFieldDirty(true, "name.firstname");
runner.setFieldTouched(true, "name.lastname");

runner.validateAsync(user)
.then((isValid) => {

    console.log("Form Validation: ", isValid ? "passed": "failed");

    console.log("Dirty: ", JSON.stringify(runner.dirty))
    console.log("Touched: ", JSON.stringify(runner.touched))
    console.log("Errors: ", JSON.stringify(runner.errors))
    
    console.log("name.firstname: ", JSON.stringify(runner.dirty.name?.firstname));
    console.log("name.firstname: ", JSON.stringify(runner.touched.name?.firstname));
    console.log("name.firstname: ", JSON.stringify(runner.errors.name?.firstname));
    
    console.log("name.lastname: ", JSON.stringify(runner.dirty.name?.lastname))
    console.log("name.lastname: ", JSON.stringify(runner.touched.name?.lastname))
    console.log("name.lastname: ", JSON.stringify(runner.errors.name?.lastname));
    
    console.log("roles[0]: ", JSON.stringify(runner.dirty.roles?.[0]));
    console.log("roles[0]: ", JSON.stringify(runner.touched.roles?.[0]));
    console.log("roles[0]: ", JSON.stringify(runner.errors.roles?.[0]));
    
    console.log("roles[1]: ", JSON.stringify(runner.dirty.roles?.[1]));
    console.log("roles[1]: ", JSON.stringify(runner.touched.roles?.[1]));
    console.log("roles[1]: ", JSON.stringify(runner.errors.roles?.[1]));
    
    console.log("name.address: ", JSON.stringify(runner.dirty.address));
    console.log("name.address: ", JSON.stringify(runner.touched.address));
    console.log("name.address: ", JSON.stringify(runner.errors.address));
});



