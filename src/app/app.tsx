import { YupValidator } from "../yup/YupValidator";
import { useFormValidation } from "../lib/UseFormValidation.hook";
import { User, user } from "./user.data";
import { userSchema } from "./app.validation";
import { useEffect, useState } from "react";
import { flattenObjectToArray, setDeep } from "../lib/ObjectUpdater";

function App() {
  const [userState, setUserState] = useState<User>(user);
  const {
    errors,
    touched,
    dirty,
    isSubmitting,
    validate,
    setIsSubmitting: setIsSubmitting,
    isDirty,
    isValid,
    getFieldState,
    getFieldTouched,
    setFieldTouched,
    setFieldsTouched,
    setTouchedAll,
    getFieldDirty,
    setFieldDirty,
    setFieldsDirty,
    setDirtyAll,
    getFieldValid,
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
      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 500" }}>

          <div style={{ marginBottom: 20 }}>
            <div>Field State for firstname:</div>
            <pre>{JSON.stringify(getFieldState("name.firstname", userState.name.firstname, userState.name.firstname), null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Submitting</div>
            <div><span>IsSubmitting: </span>{JSON.stringify(isSubmitting)}</div>
            <button onClick={() => setIsSubmitting(true)} >Submitting</button>
            <button onClick={() => setIsSubmitting(false)} >Unsubmitting</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Field Touched (by name) - firstname: {JSON.stringify(getFieldTouched("name.firstname"))}</div>
            <div>Field Touched (by ref) - firstname: {JSON.stringify(touched?.name?.firstname)}</div>
            <button onClick={() => setFieldTouched(true, "name.firstname")} >Touched</button>
            <button onClick={() => setFieldTouched(false, "name.firstname")} >Untouched</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Multiple Field Touched - [firstname, lastname]:</div>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
            <button onClick={() => setFieldsTouched(true, ["name.firstname", "name.lastname"])} >Touched</button>
            <button onClick={() => setFieldsTouched(false, ["name.firstname", "name.lastname"])} >Untouched</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>All Fields Touched:</div>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
            <button onClick={() => setTouchedAll(true)} >Touched</button>
            <button onClick={() => setTouchedAll(false)} >Untouched</button>
          </div>

        </div>
        <div style={{ flex: "1 1 0", padding: 50 }}>
          <div style={{ marginBottom: 20 }}>
            <div>Initial Sample Data</div>
            <textarea readOnly={true} style={{ width: "100%", border: 0, outline: "none", resize: "none", height: 50 }} defaultValue={JSON.stringify(user)}></textarea>
          </div>


          <div style={{ marginBottom: 20 }}>
            <h2>User Form</h2>
          </div>

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


        </div>
        <div style={{ flex: "0 0 500" }}>


          <div style={{ marginBottom: 20 }}>
            <div>Form State:</div>
            <pre>{JSON.stringify(userState, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Errors:</div>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Dirty:</div>
            <pre>{JSON.stringify(dirty, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Touched:</div>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
          </div>


        </div>
      </div>


    </>
  )
}

export default App
