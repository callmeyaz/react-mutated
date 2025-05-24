import { User, user } from "./app.data";
import { useEffect, useState } from "react";
import { setDeep } from "./utils";
import { JoiFormBuilder, JoiFormField } from "../Joi/JoiFormBuilder";
import { useJoiFormBuilder } from "../Joi/useJoiFormBuilder";
import { requiredValidator } from "../lib/Validators/RequiredValidator";
import { minLengthValidator } from "../lib/Validators/MinLengthValidator";
import { atleastOneItemValidator } from "../lib/Validators/AtleastOneItemValidator";

function buildValidation(builder: JoiFormBuilder) {
  return builder.group({
    name: builder.group({
      firstname: new JoiFormField([requiredValidator(), minLengthValidator(4)]),
      lastname: new JoiFormField([requiredValidator()]),
    }, []),
    roles: builder.array(new JoiFormField([requiredValidator()]), [atleastOneItemValidator()]),
    address: new JoiFormField([requiredValidator()])
  }, [])
}

function JoiApp() {
  const [userState, setUserState] = useState<User>(user);

  const {
    errors,
    touched,
    dirty,
    errorFlatList,
    validate,
    validateAsync,
    setTouchedAll,
    setDirtyAll,
    setFieldDirty,
    setFieldTouched,
  } = useJoiFormBuilder(buildValidation, userState, {});

  function reset() {
    setUserState(user);
    setDirtyAll(false);
    setTouchedAll(false);
  }

  useEffect(() => {
    validate(userState);
  }, [userState]);

  function addRole() {
    var roles = [...userState.roles, ""]
    setUserState({ ...userState, roles: roles });
  }

  return (
    <>
    <h2>Joi Test Bed</h2>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0, flexShrink: 0, flexBasis: 400 }}>
          <div style={{ marginBottom: 20 }}>
            <div>All Fields Touched:</div>
            <button onClick={() => setTouchedAll(true)} >Touched</button>
            <button onClick={() => setTouchedAll(false)} >Untouched</button>
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
            <ul>{errors?.name?.firstname?.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul>
            <div>First Name</div>
            <input value={userState.name.firstname}
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
            <ul>{errors?.name?.lastname?.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul>
            <div>Last Name</div>
            <input value={userState.name.lastname}
              onChange={(e) => {
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
                  <ul>{errors?.roles?.[index]?.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul>
                  <input key={index} value={item} onChange={
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
            <ul>{errors?.address?.map((item: string, index: number) => <li key={index}>{item}</li>)}</ul>
            <div>Address</div>
            <input value={userState.address}
              onChange={
                (e) => {
                  setUserState(s => s && setDeep(s, e.target.value, "address"));
                  setFieldDirty(true, "address");
                }}
              onBlur={() => {
                setFieldTouched(true, "address");
              }}
            />
          </div>
          <button onClick={() => reset()} >Reset</button>
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

export default JoiApp
