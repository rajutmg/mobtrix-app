export default function formValidator(obj, rules) {
  let errors = {};

  for (var key in rules) {
    if (obj[key] === undefined || obj[key] === "" || obj[key] === null) {
      errors[key] = rules[key];
    }
  }

  // check if error object is empty or nodeType
  if (Object.keys(errors).length === 0) {
    return false;
  }
  return errors;
}

/*Function to convert the backend errors Array into string */
export const getValidationErrors = (errors, setMessage) => {
  for (let key in errors) {
    errors[key] = errors[key].toString();
  }
  setMessage(errors);
};
