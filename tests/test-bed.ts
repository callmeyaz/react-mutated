import { user } from "../src/app/app.data";
import { YupFormBuilder, YupFormField } from "../src/lib/DataTypes";
import { atleastOneItemValidator, minLengthValidator, requiredValidator } from "../src/lib/ValidatorFunctions";
import * as Yup from "yup";

var builder = new YupFormBuilder();

var group = builder.group({
  name: builder.group({
    firstname: new YupFormField(Yup.string().defined(), [requiredValidator(), minLengthValidator(4)]),
    lastname: new YupFormField(Yup.string().defined(), [requiredValidator()]),
  }),
  roles: builder.array(new YupFormField(Yup.string().defined(), [requiredValidator()]), [atleastOneItemValidator()]),
  address: new YupFormField(Yup.string().defined(), [requiredValidator()])
});

group.validate(user);

