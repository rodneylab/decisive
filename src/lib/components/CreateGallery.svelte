<script lang="ts">
  import { browser } from '$app/env';
  import LessIcon from '$lib/components/Icons/Less.svelte';
  import MoreIcon from '$lib/components/Icons/More.svelte';
  import InputField from '$lib/components/InputField.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import { DAYS } from '$lib/constants/time';
  import galleries from '$lib/shared/stores/galleries';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import { tick } from 'svelte';

  $: submitting = false;

  let name = '';
  let slug = '';
  let streetAddress = '';
  let locality = '';
  let city = 'London';
  let postalCode = '';
  let country = 'United Kingdom';
  let openingHours = [{ startDay: 0, endDay: 6, openingTime: '10:00', closingTime: '18:00' }];
  let nearestTubes: string[] = [''];
  let googleMap = '';
  let website = '';
  let errors: {
    name?: string;
    slug?: string;
    streetAddress?: string;
    locality?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    googleMap?: string;
    website?: string;
  };
  $: errors = {};

  async function clearFormFields() {
    name = '';
    slug = '';
    streetAddress = '';
    locality = '';
    city = 'London';
    postalCode = '';
    country = 'United Kingdom';
    openingHours = [{ startDay: 0, endDay: 6, openingTime: '10:00', closingTime: '18:00' }];
    nearestTubes = [''];
    googleMap = '';
    website = '';
  }

  function createSlug(name: string) {
    let result = name.toLowerCase();
    return result.replace(/ /g, '-');
  }

  function handleFewerTubeStations(index: number) {
    nearestTubes = [...nearestTubes.slice(0, index), ...nearestTubes.slice(index + 1)];
  }

  function handleFewerOpeningHours(index: number) {
    openingHours = [...openingHours.slice(0, index), ...openingHours.slice(index + 1)];
  }

  async function handleMoreOpeningHours() {
    try {
      const template = openingHours.at(-1);
      const startDay = Math.min(6, template.endDay + 1);
      const { closingTime, openingTime } = template;
      openingHours = [...openingHours, { startDay, endDay: 6, openingTime, closingTime }];
      if (browser) {
        await tick();
        document.getElementById(`create-gallery-opening-start-${openingHours.length - 1}`);
      }
    } catch (error) {
      console.log(`Error in handleMoreOpeningHours function in CreateGallery`);
    }
  }

  async function handleMoreTubeStations() {
    try {
      nearestTubes = [...nearestTubes, ''];
      if (browser) {
        await tick();
        document.getElementById(`create-gallery-tube-${nearestTubes.length - 1}`).focus();
      }
    } catch (error) {
      console.log(`Error in handleMoreTubeStations function in CreateGallery`);
    }
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const response = await fetch('/query/create/gallery.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            name,
            slug,
            postalAddress: {
              streetAddress,
              locality,
              city,
              postalCode,
              country
            },
            openingHours: {
              openingHoursRanges: openingHours
            },
            nearestTubes,
            googleMap,
            website
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, gallery } = responseData.data.createGallery;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        galleries.set([...$galleries, gallery]);
        clearFormFields();
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in CreateGallery: ${error}`);
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <InputField
    value={name}
    id="create-gallery-name"
    placeholder="Gallery name"
    title="Name"
    error={errors?.name ?? null}
    on:update={(event) => {
      name = event.detail;
      if (slug === '') {
        slug = createSlug(event.detail);
      }
    }}
  />
  <InputField
    value={slug}
    id="create-gallery-slug"
    placeholder="gallery-slug"
    title="Slug"
    error={errors?.slug ?? null}
    on:update={(event) => {
      slug = event.detail;
    }}
  />
  <InputField
    value={streetAddress}
    id="create-gallery-street-address"
    placeholder={PLACEHOLDER_TEXT.streetAddress}
    title={TITLE.streetAddress}
    error={errors?.streetAddress ?? null}
    on:update={(event) => {
      streetAddress = event.detail;
    }}
  />
  <InputField
    value={locality}
    id="create-gallery-locality"
    placeholder="Locality"
    title="Locality"
    error={errors?.locality ?? null}
    on:update={(event) => {
      locality = event.detail;
    }}
  />
  <InputField
    value={city}
    id="create-gallery-city"
    placeholder="City"
    title="City"
    error={errors?.city ?? null}
    on:update={(event) => {
      city = event.detail;
    }}
  />
  <InputField
    value={postalCode}
    id="create-gallery-postal-code"
    placeholder="Postal Code"
    title="Postal code"
    error={errors?.postalCode ?? null}
    on:update={(event) => {
      postalCode = event.detail;
    }}
  />
  <InputField
    value={country}
    id="create-gallery-country"
    placeholder="Country"
    title="Country"
    error={errors?.country ?? null}
    on:update={(event) => {
      country = event.detail;
    }}
  />
  {#each openingHours as { startDay, endDay, openingTime, closingTime }, index}
    <InputField
      value={DAYS[startDay]}
      id={`create-gallery-opening-start-${index}`}
      placeholder="First day in range"
      title="Opening Time"
      on:update={(event) => {
        const day = DAYS.findIndex(
          (element) => element.toLowerCase() === event.detail.toLowerCase()
        );
        if (day !== -1) {
          openingHours[index].startDay = day;
        } else {
          openingHours[index].startDay =
            index === 0 ? 0 : Math.min(6, openingHours[index - 1].endDay + 1);
        }
      }}
    />
    <InputField
      value={DAYS[endDay]}
      id={`create-gallery-opening-end-${index}`}
      placeholder="Last day in range"
      title="Closing Time"
      on:update={(event) => {
        const day = DAYS.findIndex(
          (element) => element.toLowerCase() === event.detail.toLowerCase()
        );
        if (day !== -1) {
          openingHours[index].endDay = day;
        } else {
          openingHours[index].endDay = 6;
        }
      }}
    />
    <InputField
      value={openingTime}
      id={`create-gallery-opening-open-${index}`}
      placeholder="09:00"
      title="Opening Time"
      on:update={(event) => {
        openingHours[index].openingTime = event.detail;
      }}
    />
    <InputField
      value={closingTime}
      id={`create-gallery-opening-close-${index}`}
      placeholder="18:00"
      title="Closing Time"
      on:update={(event) => {
        openingHours[index].closingTime = event.detail;
      }}
    />
    {#if index > 0}
      <button
        on:click|preventDefault={() => {
          handleFewerOpeningHours(index);
        }}><LessIcon /></button
      >
    {/if}
  {/each}
  <button on:click|preventDefault={handleMoreOpeningHours}
    ><span class="screen-reader-text">Add another set of opening hours</span><MoreIcon /></button
  >
  {#each nearestTubes as stationName, index}
    <InputField
      value={stationName}
      id={`create-gallery-tube-${index}`}
      placeholder="Nearest tube station"
      title="Nearest tube station"
      on:update={(event) => {
        nearestTubes[index] = event.detail;
      }}
    />
    {#if index > 0}
      <button
        aria-label="Remove this station"
        on:click|preventDefault={() => {
          handleFewerTubeStations(index);
        }}><LessIcon /></button
      >
    {/if}
  {/each}
  <button aria-label="Add an extra station" on:click|preventDefault={handleMoreTubeStations}
    ><MoreIcon /></button
  >
  <InputField
    value={googleMap}
    id="create-gallery-map"
    placeholder="Map Link"
    title="Map Link"
    error={errors?.googleMap ?? null}
    on:update={(event) => {
      errors.googleMap = null;
      googleMap = event.detail;
    }}
  />
  <InputField
    value={website}
    id="create-gallery-website"
    placeholder="Website Link"
    title="Website Link"
    error={errors?.website ?? null}
    on:update={(event) => {
      errors.website = null;
      website = event.detail;
    }}
  />
  <button type="submit" disabled={submitting}>Create new gallery</button>
</form>
