export function mapErrorsToFields(formErrors) {
  const result = formErrors.reduce((accumulator, currentValue) => {
    const key = currentValue.field;
    if (!accumulator[key]) {
      accumulator[key] = {};
    }
    accumulator[key] = currentValue.message;
    return accumulator;
  }, {});
  return result;
}
