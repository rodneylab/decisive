<script lang="ts">
  import { browser } from '$app/env';
  import DayInputField from '$lib/components/DayInputField.svelte';
  import LessIcon from '$lib/components/Icons/Less.svelte';
  import MoreIcon from '$lib/components/Icons/More.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import { DAYS } from '$lib/constants/time';
  import type { CreateGalleryInput } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import type { GalleryFormErrors } from '$lib/utilities/form';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import slugify from 'slugify';
  import { tick } from 'svelte';

  $: submitting = false;

  export let tubeStationsNames: string[];

  function sessionGet(field: string): string | null {
    return browser ? window.sessionStorage.getItem(`create-gallery-${field}`) ?? '' : '';
  }

  let name = sessionGet('name');
  let slug = sessionGet('slug');
  let streetAddress = '';
  let locality = '';
  let city = 'London';
  let postalCode = '';
  let country = 'United Kingdom';
  let openingHours = [{ startDay: 0, endDay: 6, openingTime: '10:00', closingTime: '18:00' }];
  let nearestTubes: string[] = [''];
  let openStreetMapUrl = '';
  let website = '';
  let errors: GalleryFormErrors = {};

  function clearFormFields() {
    ['name', 'slug'].forEach((element) => sessionStorage.removeItem(`create-gallery-${element}}`));
    name = '';
    slug = '';
    streetAddress = '';
    locality = '';
    city = 'London';
    postalCode = '';
    country = 'United Kingdom';
    openingHours = [{ startDay: 0, endDay: 6, openingTime: '10:00', closingTime: '18:00' }];
    nearestTubes = [''];
    openStreetMapUrl = '';
    website = '';
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
        document.getElementById(`create-gallery-opening-start-${openingHours.length - 1}`).focus();
      }
    } catch (error) {
      console.error(`Error in handleMoreOpeningHours function in CreateGallery`);
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
      console.error(`Error in handleMoreTubeStations function in CreateGallery`);
    }
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const filteredOpeningHours = openingHours.filter(
        (element) => element.startDay !== -1 && element.endDay !== -1
      );
      const data: CreateGalleryInput = {
        name,
        slug,
        postalAddress: {
          streetAddress,
          locality,
          city,
          postalCode,
          country
        },
        openingHours:
          filteredOpeningHours.length > 0 ? { openingHoursRanges: filteredOpeningHours } : null,
        nearestTubes,
        openStreetMapUrl,
        website
      };
      const response = await fetch('/query/create/gallery.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: data })
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

  function sessionStore(field: string, value: string) {
    browser && window.sessionStorage.setItem(`create-gallery-${field}`, value);
  }
</script>

<aside id="create-gallery">
  <form on:submit|preventDefault={handleSubmit}>
    <TextInputField
      value={name}
      id="create-gallery-name"
      placeholder="Gallery name"
      title="Name"
      error={errors?.name ?? null}
      on:update={(event) => {
        const { detail } = event;
        name = detail;
        sessionStore('name', detail);
        if (slug === '') {
          slug = slugify(detail, { remove: /[\.']/g, lower: true });
        }
      }}
    />
    <TextInputField
      value={slug}
      id="create-gallery-slug"
      placeholder="gallery-slug"
      title="Slug"
      error={errors?.slug ?? null}
      on:update={(event) => {
        const { detail } = event;
        slug = detail;
        sessionStore('slug', detail);
      }}
    />
    <TextInputField
      value={streetAddress}
      id="create-gallery-street-address"
      placeholder={PLACEHOLDER_TEXT.streetAddress}
      title={TITLE.streetAddress}
      error={errors?.streetAddress ?? null}
      on:update={(event) => {
        streetAddress = event.detail;
      }}
    />
    <TextInputField
      value={locality}
      id="create-gallery-locality"
      placeholder="Locality"
      title="Locality"
      error={errors?.locality ?? null}
      on:update={(event) => {
        locality = event.detail;
      }}
    />
    <TextInputField
      value={city}
      id="create-gallery-city"
      placeholder="City"
      title="City"
      error={errors?.city ?? null}
      on:update={(event) => {
        city = event.detail;
      }}
    />
    <TextInputField
      value={postalCode}
      id="create-gallery-postal-code"
      placeholder="Postal Code"
      title="Postal code"
      error={errors?.postalCode ?? null}
      on:update={(event) => {
        postalCode = event.detail;
      }}
    />
    <TextInputField
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
      <DayInputField
        value={DAYS[startDay]}
        id={`create-gallery-opening-start-${index}`}
        placeholder="First day in range"
        title="Opening Time"
        error={errors?.[`startDay${index}`] ?? null}
        on:update={(event) => {
          if (event.detail === '') {
            openingHours[index].startDay = -1;
            openingHours[index].endDay = -1;
            openingHours[index].openingTime = '';
            openingHours[index].closingTime = '';
          } else {
            const day = DAYS.findIndex(
              (element) => element.toLowerCase() === event.detail.toLowerCase()
            );
            if (day !== -1) {
              openingHours[index].startDay = day;
            } else {
              openingHours[index].startDay =
                index === 0 ? 0 : Math.min(6, openingHours[index - 1].endDay + 1);
            }
          }
        }}
      />
      <DayInputField
        value={DAYS[endDay]}
        id={`create-gallery-opening-end-${index}`}
        placeholder="Last day in range"
        title="Closing Time"
        error={errors?.[`endDay${index}`] ?? null}
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
      <TextInputField
        value={openingTime}
        id={`create-gallery-opening-open-${index}`}
        placeholder="09:00"
        title="Opening Time"
        error={errors?.[`openingTime${index}`] ?? null}
        on:update={(event) => {
          const { detail } = event;
          if (/^([0-1]\d|2[0-3])$/.test(detail)) {
            openingHours[index].openingTime = `${detail}:00`;
          } else if (/^\d$/.test(detail)) {
            openingHours[index].openingTime = `0${detail}:00`;
          } else {
            openingHours[index].openingTime = detail;
          }
        }}
      />
      <TextInputField
        value={closingTime}
        id={`create-gallery-opening-close-${index}`}
        placeholder="18:00"
        title="Closing Time"
        error={errors?.[`closingTime${index}`] ?? null}
        on:update={(event) => {
          const { detail } = event;
          if (/^([0-1]\d|2[0-3])$/.test(detail)) {
            openingHours[index].closingTime = `${detail}:00`;
          } else if (/^\d$/.test(detail)) {
            openingHours[index].closingTime = `0${detail}:00`;
          } else {
            openingHours[index].closingTime = detail;
          }
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
      <TextInputField
        value={stationName}
        id={`create-gallery-tube-${index}`}
        placeholder="Nearest tube station"
        title="Nearest tube station"
        dataList={tubeStationsNames}
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
    <TextInputField
      value={openStreetMapUrl}
      id="create-gallery-map"
      placeholder={PLACEHOLDER_TEXT.openStreetMap}
      title={TITLE.openStreetMap}
      error={errors?.openStreetMap ?? null}
      on:update={(event) => {
        errors.openStreetMap = null;
        openStreetMapUrl = event.detail.trim();
      }}
    />
    <TextInputField
      value={website}
      id="create-gallery-website"
      placeholder="Website Link"
      title="Website Link"
      error={errors?.website ?? null}
      on:update={(event) => {
        errors.website = null;
        website = event.detail.trim();
      }}
    />
    <button type="submit" disabled={submitting}>Create new gallery</button>
  </form>
</aside>

<style>
  .screen-reader-text {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    width: 1px;
    overflow: hidden;
    position: absolute !important;
    word-wrap: normal !important;
  }
</style>
