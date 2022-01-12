<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';

  export const load = async ({ fetch, params, url }: LoadInput) => {
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
        credentials: 'include'
      });
      const { slug } = params;
      return {
        props: { ...(await response.json()), ...data, slug }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import type { CreateTubeStationInput, Mutation, TubeStation, User } from '$lib/generated/graphql';
  import { tubeStations } from '$lib/shared/stores/tubeStations';
  import user from '$lib/shared/stores/user';
  import { mapErrorsToFields, TubeStationFormErrors } from '$lib/utilities/form';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import slugify from 'slugify';
  import { onMount } from 'svelte';

  export let data: { tubeStations: TubeStation[] };
  export let me: User | null;
  // export let slug: string;
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
  let slug = '';
  let errors: TubeStationFormErrors;
  $: errors = { name: undefined, slug: undefined };

  $: mapErrorsToFields;

  async function handleDelete(id: string) {
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

  async function handleEdit(slug: string) {
    await prefetch(`/tube-station/${slug}`);
    goto(`tube-station/${slug}`);
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const input: CreateTubeStationInput = { name, slug };
      const response = await fetch('/query/create/tube-station.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });
      const responseData = await response.json();

      const { errors: formErrors, tubeStation }: Mutation['createTubeStation'] =
        responseData.data.createTubeStation;
      submitting = false;
      name = '';
      slug = '';
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
<h1>Tube Stations</h1>
<h2>Current Stations</h2>
<ul>
  {#each [...$tubeStations] as { id, name, slug }}
    <li>
      <h3>
        <a aria-label={`Edit ${name} station`} sveltekit:prefetch href={`/tube-station/${slug}/`}
          >{name}</a
        >
      </h3>
      <button aria-label="Edit station" type="button" on:click={() => handleEdit(slug)}
        ><EditIcon /></button
      ><button aria-label="Delete station" type="button" on:click={() => handleDelete(id)}
        ><DeleteIcon /></button
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
      const { detail } = event;
      name = detail;
      if (slug === '') {
        slug = slugify(detail, { remove: /[\.()']/g, lower: true });
      }
    }}
  />
  <TextInputField
    value={slug}
    id="create-station-slug"
    placeholder="tube-station-slug"
    title="Slug"
    error={errors?.slug ?? null}
    on:update={(event) => {
      slug = event.detail;
    }}
  />
  <button type="submit" disabled={submitting}>Create new station</button>
</form>
