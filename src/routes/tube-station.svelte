<script context="module">
  export const load = async ({ fetch, page }) => {
    try {
      // check for valid user session
      const meResponse = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include'
      });
      const { data } = await meResponse.json();
      if (!data?.me) {
        return {
          status: 301,
          redirect: '/login'
        };
      }

      const response = await fetch('/query/tube-station.json', {
        method: 'POST',
        credentials: 'same-origin'
      });
      const { slug } = page.params;
      return {
        props: { ...(await response.json()), ...data, slug }
      };
    } catch (error) {
      console.error(`Error in load function for /tube-station: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import type { TubeStation, User } from '$lib/generated/graphql';
  import { tubeStations } from '$lib/shared/stores/tubeStations';
  import user from '$lib/shared/stores/user';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import { onMount } from 'svelte';

  export let data: { tubeStations: TubeStation[] };
  export let me: User | null;
  export let slug: string;
  $: submitting = false;

  async function checkForLoggedInUser() {
    if (!$user && browser) {
      if (me) {
        user.set({ ...me });
      } else {
        await prefetch('/login');
        await goto('/login');
      }
    }
  }

  onMount(() => {
    checkForLoggedInUser();
  });

  tubeStations.set(data.tubeStations);

  let name = '';
  let errors: { name: string | undefined };
  $: errors = { name: undefined };

  $: mapErrorsToFields;

  async function handleDelete(id: number) {
    try {
      const response = await fetch('/query/delete/tube-station.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const responseData = await response.json();
      const { deleteTubeStation: deleted } = responseData.data.data;
      console.log('Deleted? : ', deleted);
      const index = $tubeStations.findIndex((element) => element.id === id);
      tubeStations.set([...$tubeStations.slice(0, index), ...$tubeStations.slice(index + 1)]);
    } catch (error) {
      console.error(`Error in handleDelete function in /tube-station: ${error}`);
    }
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const response = await fetch('/query/create/tube-station.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      const responseData = await response.json();

      const { errors: formErrors, tubeStation } = responseData.data.createTubeStation;
      submitting = false;
      name = '';
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
  {#each [...$tubeStations] as { id, name }}
    <li>
      <h3>{name}</h3>
      <EditIcon /><button
        aria-label="Delete station"
        type="button"
        on:click={() => handleDelete(id)}><DeleteIcon /></button
      >
    </li>
  {/each}
</ul>

<h2>Add a New Station</h2>
<form on:submit|preventDefault={handleSubmit}>
  <span class="screen-reader-text"><label for="create-station-name">Name</label></span>
  <TextInputField
    value={name}
    id="create-station-name"
    placeholder="Station name"
    title="Name"
    on:update={(event) => {
      name = event.detail;
    }}
  />
  {#if errors?.name}
    <small class="error-text">{errors.name} </small>
  {/if}
  <button type="submit" disabled={submitting}>Create new station</button>
</form>

<style>
  .error-text {
    color: #c42021;
  }
</style>
