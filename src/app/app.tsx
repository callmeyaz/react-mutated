import { YupValidator } from "../yup/YupValidator";
import { useFormValidation } from "../lib/hooks/UseFormValidation.hook";
import { User, user } from "./app.data";
import { userSchema } from "./app.validation";
import { useEffect, useState } from "react";
import { setDeep } from "../lib/Utils";

function App() {
  const [userState, setUserState] = useState<User>(user);
  const {
    errors,
    touched,
    dirty,
    isSubmitting,
    errorFlatList,
    validate,
    validateAsync,
    setIsSubmitting,
    isFormDirty,
    isFormValid,
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

  function runValidation(): boolean {
    return validate();
  }

  function addRole() {
    var roles = [...userState.roles, ""]
    setUserState({ ...userState, roles: roles });
    setFieldsTouched(true, roles.map((_, index) => `roles[${index}]`))
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0, flexShrink: 0, flexBasis: 400 }}>

          <div style={{ marginBottom: 20 }}>
            <div>Field State for firstname:</div>
            <pre>{JSON.stringify(getFieldState("name.firstname", userState.name.firstname, userState.name.firstname), null, 2)}</pre>
          </div>

          <div>Is Form Valid: { JSON.stringify(isFormValid()) }</div>
          <div>Is Form Dirty: { JSON.stringify(isFormDirty()) }</div>
          <div>Field Touched (by name) - firstname: {JSON.stringify(getFieldTouched("name.firstname"))}</div>
          <div>Field Dirty (by name) - firstname: {JSON.stringify(getFieldDirty("name.firstname"))}</div>
          <div>Field Valid (by name) - firstname: {JSON.stringify(getFieldValid("name.firstname"))}</div>
          <div>Field Errors (by name) - firstname: {JSON.stringify(getFieldErrors("name.firstname"))}</div>

          <div style={{ marginBottom: 20 }}>
            <div><span>Submitting: </span>{JSON.stringify(isSubmitting)}</div>
            <button onClick={() => setIsSubmitting(true)} >Submitting</button>
            <button onClick={() => setIsSubmitting(false)} >Unsubmitting</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Field Touched (by ref) - firstname: {JSON.stringify(touched?.name?.firstname)}</div>
            <button onClick={() => setFieldTouched(true, "name.firstname")} >Touched</button>
            <button onClick={() => setFieldTouched(false, "name.firstname")} >Untouched</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Multiple Field Touched - [firstname, lastname]:</div>
            <button onClick={() => setFieldsTouched(true, ["name.firstname", "name.lastname"])} >Touched</button>
            <button onClick={() => setFieldsTouched(false, ["name.firstname", "name.lastname"])} >Untouched</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>All Fields Touched:</div>
            <button onClick={() => setTouchedAll(true)} >Touched</button>
            <button onClick={() => setTouchedAll(false)} >Untouched</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Field Dirty (by ref) - firstname: {JSON.stringify(dirty?.name?.firstname)}</div>
            <button onClick={() => setFieldDirty(true, "name.firstname")} >Dirty</button>
            <button onClick={() => setFieldDirty(false, "name.firstname")} >Not Dirty</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Multiple Field Dirty - [firstname, lastname]:</div>
            <button onClick={() => setFieldsDirty(true, ["name.firstname", "name.lastname"])} >Dirty</button>
            <button onClick={() => setFieldsDirty(false, ["name.firstname", "name.lastname"])} >Not Dirty</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>All Fields Dirty:</div>
            <button onClick={() => setDirtyAll(true)} >Dirty</button>
            <button onClick={() => setDirtyAll(false)} >Not Dirty</button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Error Flat List:</div>
            <div>{JSON.stringify(errorFlatList)}</div>
          </div>


        </div>

        <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, padding: 50 }}>
          <div style={{ marginBottom: 20 }}>
            <div>Initial Sample Data</div>
            <textarea readOnly={true} style={{ width: "100%", border: 0, outline: "none", resize: "none", height: 50 }} defaultValue={JSON.stringify(user)}></textarea>
          </div>
          <div style={{ marginBottom: 20 }}>
            <h2>User Form</h2>
          </div>
          <div>
            <ul>{!!touched?.name?.firstname && errors?.name?.firstname?.map((item, index) => <li key={index}>{item}</li>)}</ul>
            <div>First Name</div>
            <input
              onChange={(e) => {
                setUserState(s => s && setDeep(s, e.target.value, "name.firstname"));
                setFieldDirty(true, "name.firstname");
              }}
              onBlur={() => {
                setFieldTouched(true, "name.firstname");
              }}
            />
          </div>
          <div>
            <ul>{!!touched?.name?.lastname && errors?.name?.lastname?.map((item, index) => <li key={index}>{item}</li>)}</ul>
            <div>Last Name</div>
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
            <div>Roles</div>
            {
              userState.roles.map((item, index) => (
                <div key={index}>
                  <ul>{!!touched?.roles?.[index] && errors?.roles?.[index]?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  <input key={index} defaultValue={item} onChange={
                    (e) => {
                      setUserState(s => s && setDeep(s, e.target.value, `roles[${index}]`));
                      setFieldDirty(true, `roles[${index}]`);
                    }}
                    onBlur={() => {
                      setFieldTouched(true, `roles[${index}]`);
                    }}
                  />
                </div>
              ))
            }
          </div>
          <div>
            <ul>{!!touched?.address && errors?.address?.map((item, index) => <li key={index}>{item}</li>)}</ul>
            <div>Address</div>
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
          <button onClick={() => runValidation()} >Validate</button>
          <button onClick={() => addRole()} >Add Role</button>
        </div>

        <div style={{ flexGrow: 0, flexShrink: 0, flexBasis: 500 }}>

          <div style={{ marginBottom: 20 }}>
            <div>Form State:</div>
            <pre>{JSON.stringify(userState, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Errors:</div>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Touched:</div>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div>Form Dirty:</div>
            <pre>{JSON.stringify(dirty, null, 2)}</pre>
          </div>

        </div>
      </div>


    </>
  )
}

export default App
