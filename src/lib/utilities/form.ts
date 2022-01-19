import type { FieldError, OpeningHoursRangeInput } from '$lib/generated/graphql';

export function mapErrorsToFields(formErrors: FieldError[]) {
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

export interface ExhibitionFormErrors {
  name?: string;
  description?: string;
  summaryText?: string;
  hashtags?: string;
}

export interface GalleryFormErrors {
  name?: string;
  slug?: string;
  streetAddress?: string;
  locality?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  tubeStation?: string;
  openStreetMap?: string;
  website?: string;
}

export interface PhotographerFormErrors {
  firstName?: string;
  lastName?: string;
  otherNames?: string;
  slug?: string;
  website?: string;
}

export interface TubeStationFormErrors {
  name?: string;
  slug?: string;
}
