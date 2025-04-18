import * as Yup from "yup";
import { User } from "./user.data";
import { IYupValidationErrorMessage } from "../yup/IYupValidationErrorMessage";

export const userSchema: Yup.ObjectSchema<User> = Yup.object({
  name: Yup.object({
    firstname: Yup.string().default('')
      .test("name.firstname", "", function (item) {
        if (!item) {
          return this.createError({
            message: {
              key: "name.firstname",
              message: "Firstname not provided.",
              errorCode: "0001"
            } as Yup.Message<IYupValidationErrorMessage>
          });
        }
        return true;
      }),
    lastname: Yup.string().default('')
      .test("name.lastname", "", function (item) {
        if (!item) {
          return this.createError({
            message: {
              key: "name.lastname",
              message: "Lastname not provided.",
              errorCode: "0002"
            } as Yup.Message<IYupValidationErrorMessage>
          });
        }
        return true;
      })
  }),
  address: Yup.string().default('')
    .test("address", "", function (item) {
      if (!item) {
        return this.createError({
          message: {
            key: "address",
            message: "Address Not provided",
            errorCode: "0003"
          } as Yup.Message<IYupValidationErrorMessage>
        });
      }
      return true;
    })
});