<script context="module">
  export const load = async ({ fetch, page }) => {
    try {
      const response = await fetch('/query/tube-station.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { slug } = page.params;
      return {
        props: { ...(await response.json()), slug }
      };
    } catch (error) {
      console.error(`Error in load function for /tube-station: ${error}`);
    }
  };
</script>

<script lang="ts">
  import SEO from '$lib/components/SEO/index.svelte';
  import { tubeStations } from '$lib/shared/stores/tubeStations';

  export let data;
  export let slug;
  $: submitting = false;

  tubeStations.set(data.tubeStations);

  let name = '';
  let errors: { name: string | undefined };
  $: errors = { name: undefined };

  $: mapErrorsToFields;

  function mapErrorsToFields(formErrors) {
    const result = formErrors.reduce((accumulator, currentValue) => {
      const key = currentValue.field;
      if (!accumulator[key]) {
        accumulator[key] = {};
      }
      accumulator[key] = currentValue.message;
      return accumulator;
    }, {});
    errors = { ...result };
    return result;
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const response = await fetch('/query/create/tube-station.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      const responseData = await response.json();

      const { errors: formErrors, tubeStation } = responseData.data.createTubeStation;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        tubeStations.set([...$tubeStations, tubeStation]);
      }
    } catch (error) {
      console.error(`Error in load function for /gallery: ${error}`);
    }
  }
</script>

<SEO title="Tube Stations" {slug} metadescription="Tube Stations" />
<!-- <pre>{JSON.stringify(data, null, 2)}</pre>
<pre>{JSON.stringify($tubeStations, null, 2)}</pre> -->
<h1>Tube Stations</h1>
<h2>Current Stations</h2>
<ul>
  {#each [...$tubeStations] as { name }}
    <li>
      <h3>{name}</h3>
    </li>
  {/each}
</ul>

<h2>Add a new Station</h2>
<form on:submit|preventDefault={handleSubmit}>
  <span class="screen-reader-text"><label for="create-station-name">Name</label></span>
  <input
    bind:value={name}
    required
    id="create-station-name"
    placeholder="Station name"
    title="Name"
    type="text"
  />
  {#if errors?.name}
    <small>{errors.name} </small>
  {/if}
  <button type="submit" disabled={submitting}>Create new station</button>
</form>
