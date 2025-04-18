import { IYupValidationErrorMessage } from "./yup/IYupValidationErrorMessage";
import { YupValidator } from "./yup/YupValidator";
import { useFormValidation } from "./hooks/use-form-validation";
import * as Yup from "yup";
import { useEffect, useState } from "react";

type User = {
  name: {
    firstname: string,
    lastname: string
  },
  address: string
};

var user = {
  name: {
    firstname: "",
    lastname: ""
  },
  address: ""
} as User;

const userSchema: Yup.ObjectSchema<User> = Yup.object({
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

function App() {
  const {
    errors,
    touched,
    isSubmitting,
    buildFieldState,
    getFieldTouched,
    runValidation,
    setIsSubmitting,
    setFieldTouched,
    setFieldsTouched,
    touchedAll
  } = useFormValidation(new YupValidator(userSchema), user);

  function handleRunValidation() {
    runValidation();
  }

  return (
    <>
      App is running!
      <div><span>Field State: </span>{JSON.stringify(buildFieldState("name.firstname", "John", "Jane"))}</div>
      <div><span>Touched: </span>{JSON.stringify(touched)}</div>
      <div><span>IsSubmitting: </span>{JSON.stringify(isSubmitting)}</div>
      <div><span>First name touched: </span>{JSON.stringify(getFieldTouched("name.firstname"))}</div>
      <div>{
        errors?.map((item, index) => (
          <li key={index} style={{ color: '#ff0000' }}>{item.message}</li>
        ))
      }
      </div>

      <div>
        <div>First Name</div>
        <input
          onChange={
            (e) => {
              user.name.firstname = e.currentTarget.value;
              setFieldTouched(true, "name.firstname")
            }
          }
          onBlur={
            (e) => {
            setFieldTouched(true, "name.firstname")
            }
          }
        />
      </div>
      <div>
        <div>Last Name</div>
        <input onChange={
          (e) => {
            user.name.lastname = e.currentTarget.value;
            setFieldTouched(true, "name.lastname")
          }
        }
        onBlur={
          (e) => {
            setFieldTouched(true, "name.lastname")
          }
        }
        />
      </div>
      <div>
        <div>Address</div>
        <input onChange={
          (e) => {
            user.address = e.currentTarget.value;
            setFieldTouched(true, "address")
          }
        }
        onBlur={
          (e) => {
            setFieldTouched(true, "address")
          }
        }
        />
      </div>


      <button onClick={() => handleRunValidation()} >validate</button>
      <button onClick={() => setIsSubmitting(true)} >set is submitting - true</button>
      <button onClick={() => setIsSubmitting(false)} >set is submitting - false</button>
      <button onClick={() => setFieldTouched(true, "name.firstname")} >set firstname field touched</button>
      <button onClick={() => setFieldTouched(false, "name.firstname")} >set firstname field untouched</button>
      <button onClick={() => setFieldsTouched(true, ["name.firstname", "name.lastname"])} >set [firstname, lastname] fields touched</button>
      <button onClick={() => setFieldsTouched(false, ["name.firstname", "name.lastname"])} >set [firstname, lastname] fields untouched</button>
      <button onClick={() => touchedAll(true)} >set touched all</button>
      <button onClick={() => touchedAll(false)} >set untouched all</button>
    </>
  )
}

export default App
