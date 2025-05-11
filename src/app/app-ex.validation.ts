import * as Yup from "yup";
import { User } from "./app.data";
import { IYupValidationMessage } from "../yup/IYupValidationErrorMessage";


export const AppExSchema: Yup.ObjectSchema<User> = Yup.object({
  name: Yup.object({
    firstname: Yup.string().defined()
      .test("name.firstname required", function (item) {
        if (!item) {
          return this.createError({
            message: {
              key: this.path,
              message: "Firstname not provided.",
              errorCode: "0001"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      })
      .test("name.firstname min", function (item) {
        if (!item || item.length < 4) {
          return this.createError({
            message: {
              key: this.path,
              message: "Firstname min length is 4 characters.",
              errorCode: "0001"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      }),
    lastname: Yup.string().defined()
      .test("name.lastname", function (item) {
        if (!item) {
          return this.createError({
            message: {
              key: this.path,
              message: "Lastname not provided.",
              errorCode: "0002"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      })
  }),
  roles: Yup.array().defined().of(
    Yup.string().defined()
      .test("roles", function (item) {
        if (!item) {
          return this.createError({
            message: {
              key: this.path,
              message: "Role Not provided",
              errorCode: "0003"
            } as Yup.Message<IYupValidationMessage>
          });
        }
        return true;
      })
  ),
  address: Yup.string().defined()
    .test("address", function (item) {
      if (!item) {
        return this.createError({
          message: {
            key: this.path,
            message: "Address Not provided",
            errorCode: "0004"
          } as Yup.Message<IYupValidationMessage>
        });
      }
      return true;
    })
});