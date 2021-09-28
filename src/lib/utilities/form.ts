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

export interface GalleryFormErrors {
  name?: string;
  slug?: string;
  streetAddress?: string;
  locality?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  googleMap?: string;
  website?: string;
}
