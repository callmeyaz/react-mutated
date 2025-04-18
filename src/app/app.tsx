import { YupValidator } from "../yup/YupValidator";
import { useFormValidation } from "../lib/UseFormValidation.hook";
import { user } from "./user.data";
import { userSchema } from "./app.validation";
import { useState } from "react";

function App() {
  const {
    errors,
    touched,
    isSubmitting,
    getFieldState,
    getFieldTouched,
    runValidation,
    setIsSubmitting,
    setFieldTouched,
    setFieldsTouched,
    touchedAll
  } = useFormValidation(new YupValidator(userSchema), user);
  const [userState, setUserState] = useState(user);

  function handleRunValidation() {
    runValidation();
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div>Sample Data</div>
        <textarea readOnly={true} rows={6} style={{ width: "100%" }}>{JSON.stringify(user)}</textarea>
      </div>

      <div style={{ marginBottom: 20 }}>
      <div>Field State - firstname: { JSON.stringify(getFieldState("name.firstname", userState.name.firstname, userState.name.firstname)) }</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Submitting</div>
        <div><span>IsSubmitting: </span>{JSON.stringify(isSubmitting)}</div>
        <button onClick={() => setIsSubmitting(true)} >set is submitting - true</button>
        <button onClick={() => setIsSubmitting(false)} >set is submitting - false</button>
      </div>


      <div style={{ marginBottom: 20 }}>
      <div>Field Touched 1 - firstname: { JSON.stringify(getFieldTouched("name.firstname")) }</div>
      <div>Field Touched 2 - firstname: { JSON.stringify(touched?.name?.firstname) }</div>
        <button onClick={() => setFieldTouched(true, "name.firstname")} >Touched</button>
        <button onClick={() => setFieldTouched(false, "name.firstname")} >Untouched</button>
      </div>

      <div style={{ marginBottom: 20 }}>
      <div>Field Touched - [firstname, lastname]: { JSON.stringify(touched) }</div>
      <button onClick={() => setFieldsTouched(true, ["name.firstname", "name.lastname"])} >Touched</button>
      <button onClick={() => setFieldsTouched(false, ["name.firstname", "name.lastname"])} >Untouched</button>
      </div>      

      <div style={{ marginBottom: 20 }}>
      <div>Touched All Fields: {JSON.stringify(touched)}</div>
      <button onClick={() => touchedAll(true)} >Touched All</button>
      <button onClick={() => touchedAll(false)} >Untouched All</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        User Form
      </div>


      <ul>{
        errors?.map((item, index) => (
          getFieldTouched(item.key) ? <li key={index} style={{ color: '#ff0000' }}>{item.message}</li> : ""
        ))
      }
      </ul>

      <div>
        <div>First Name</div>
        <input
          onChange={(e) => {
              user.name.firstname = e.currentTarget.value;
              setFieldTouched(true, "name.firstname")
            }}
          onBlur={(e) => {
              setFieldTouched(true, "name.firstname")
            }}
        />
      </div>
      <div>
        <div>Last Name</div>
        <input onChange={(e) => {
            user.name.lastname = e.currentTarget.value;
            setFieldTouched(true, "name.lastname")
          }}
          onBlur={(e) => {
              setFieldTouched(true, "name.lastname")
            }}
        />
      </div>
      <div>
        <div>Address</div>
        <input onChange={
          (e) => {user.address = e.currentTarget.value;
            setFieldTouched(true, "address")
          }}
          onBlur={(e) => {
              setFieldTouched(true, "address")
            }}
        />
      </div>


      <button onClick={() => handleRunValidation()} >validate</button>
    </>
  )
}

export default App
