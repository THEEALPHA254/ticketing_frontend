import { defineRule } from "vee-validate";

defineRule("required", (value) => {
  if (!value || !value.length) {
    return "Required";
  }
  return true;
});

defineRule("selectrequired", (value) => {
  if (typeof value === 'undefined') {
    return "Required";
  }
  return true;
});

defineRule("numberDecimal", (value) => {
 if (!value.trim()) return true;
 if (!isNaN(parseFloat(value))) return true;
 return 'Provide valid time'
});

defineRule("none", (value) => {
  return true
});

defineRule("email", (value) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }
  // Check if email
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    return "Invalid e-mail";
  }
  return true;
});
defineRule("phone", (value) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }
  // Check if 10 digit input
  if (! /(\d{0,3})(\d{0,3})(\d{0,4})/.test(value)) {
    return "Invalid phonenumber";
  }
  return true;
});



// this receives props
// <Field name="password" type="password" rules="required|minLength:8" />
defineRule("minLength", (value, [limit]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }
  if (value.length < limit) {
    return `This field must be at least ${limit} characters`;
  }
  return true;
});

