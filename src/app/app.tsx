import { YupValidator } from "../yup/YupValidator";
import { useFormValidation } from "../lib/UseFormValidation.hook";
import { User, user } from "./user.data";
import { userSchema } from "./app.validation";
import { useEffect, useState } from "react";
import { setDeep } from "../lib/ObjectUpdater";

function App() {
  const [userState, setUserState] = useState<User>(user);
  const {
    errors,
    touched,
    dirty,
    isSubmitting,
    validate,
    setIsSubmitting: setIsSubmitting,
    getFieldState,
    getFieldTouched,
    setFieldTouched,
    setFieldsTouched,
    setTouchedAll,
    getFieldDirty,
    setFieldDirty,
    setFieldsDirty,
    setDirtyAll,
    getFieldErrors

  } = useFormValidation(new YupValidator(userSchema), userState, {});

  useEffect(() => {
    runValidation();
  }, [userState])

  function runValidation() {
    validate();
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div>Sample Data</div>
        <textarea readOnly={true} rows={6} style={{ width: "100%" }} defaultValue={JSON.stringify(user)}></textarea>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Object State - firstname: {JSON.stringify(userState)}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Field State - firstname: {JSON.stringify(getFieldState("name.firstname", userState.name.firstname, userState.name.firstname))}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Submitting</div>
        <div><span>IsSubmitting: </span>{JSON.stringify(isSubmitting)}</div>
        <button onClick={() => setIsSubmitting(true)} >set is submitting - true</button>
        <button onClick={() => setIsSubmitting(false)} >set is submitting - false</button>
      </div>


      <div style={{ marginBottom: 20 }}>
        <div>Field Touched 1 - firstname: {JSON.stringify(getFieldTouched("name.firstname"))}</div>
        <div>Field Touched 2 - firstname: {JSON.stringify(touched?.name?.firstname)}</div>
        <button onClick={() => setFieldTouched(true, "name.firstname")} >Touched</button>
        <button onClick={() => setFieldTouched(false, "name.firstname")} >Untouched</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Field Touched - [firstname, lastname]: {JSON.stringify(touched)}</div>
        <button onClick={() => setFieldsTouched(true, ["name.firstname", "name.lastname"])} >Touched</button>
        <button onClick={() => setFieldsTouched(false, ["name.firstname", "name.lastname"])} >Untouched</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div>Touched All Fields: {JSON.stringify(touched)}</div>
        <button onClick={() => setTouchedAll(true)} >Touched All</button>
        <button onClick={() => setTouchedAll(false)} >Untouched All</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        User Form
      </div>


      <ul>{
        errors?.map((item, index) => (
          <li key={index} style={{ color: '#ff0000' }}>{item.message}</li>
        ))
      }
      </ul>

      <div>
        <div>First Name</div>
        <div>{getFieldTouched("name.firstname") && JSON.stringify(getFieldErrors("name.firstname"))}</div>
        <input
          onChange={(e) => {
            console.log(e);
            setUserState(s => s && setDeep(s, e.target.value, "name.firstname"));
            setFieldDirty(true, "name.firstname");
          }}
          onBlur={() => {
            setFieldTouched(true, "name.firstname");
          }}
        />
      </div>
      <div>
        <div>Last Name</div>
        <div>{getFieldTouched("name.lastname") && JSON.stringify(getFieldErrors("name.lastname"))}</div>
        <input onChange={(e) => {
          setUserState(s => s && setDeep(s, e.target.value, "name.lastname"));
          setFieldDirty(true, "name.lastname");
        }}
          onBlur={() => {
            setFieldTouched(true, "name.lastname");
          }}
        />
      </div>
      <div>
        <div>Address</div>
        <div>{getFieldTouched("address") && JSON.stringify(getFieldErrors("address"))}</div>
        <input onChange={
          (e) => {
            setUserState(s => s && setDeep(s, e.target.value, "address"));
            setFieldDirty(true, "address");
          }}
          onBlur={() => {
            setFieldTouched(true, "address");
          }}
        />
      </div>


      <button onClick={() => runValidation()} >validate</button>
    </>
  )
}

export default App
