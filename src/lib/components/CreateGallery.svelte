<script lang="ts">
  import InputField from '$lib/components/InputField.svelte';
  import { DAYS } from '$lib/constants/time';
  import galleries from '$lib/shared/stores/galleries';
  import { mapErrorsToFields } from '$lib/utilities/form';
  $: submitting = false;

  let name = '';
  let streetAddress = '';
  let locality = '';
  let city = 'London';
  let postalCode = '';
  let country = 'United Kingdom';
  let openingHours = [{ startDay: 0, endDay: 6, openingTime: '10:00', closingTime: '18:00' }];
  let nearestTubes: string[] = [''];
  let googleMap = '';
  let website = '';
  let errors: { name: string | undefined; streetAddress: string | undefined };
  $: errors = { name: undefined };

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
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in CreateGallery: ${error}`);
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <span class="screen-reader-text"><label for="create-gallery-name">Name</label></span>
  <input
    bind:value={name}
    required
    id="create-gallery-name"
    placeholder="Gallery name"
    title="Name"
    type="text"
  />
  {#if errors?.name}
    <small class="error-text">{errors.name} </small>
  {/if}

  <InputField
    value={streetAddress}
    id="create-gallery-street-address"
    placeholder="Street address"
    title="Street address"
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
        openingHours[index].startDay = event.detail;
      }}
    />
    <InputField
      value={DAYS[endDay]}
      id={`create-gallery-opening-end-${index}`}
      placeholder="Last dat in range"
      title="Closing Time"
      on:update={(event) => {
        openingHours[index].endDay = event.detail;
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
  {/each}
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
  {/each}
  <InputField
    value={googleMap}
    id="create-gallery-map"
    placeholder="Map Link"
    title="Map Link"
    error={errors?.googleMap ?? null}
    on:update={(event) => {
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
      website = event.detail;
    }}
  />
  <button type="submit" disabled={submitting}>Create new gallery</button>
</form>
