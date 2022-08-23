<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import EditableText from '$lib/components/EditableText.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type {
    TubeStation,
    TubeStationQueryResponse,
    UpdateTubeStationInput,
    User
  } from '$lib/generated/graphql';
  import { tubeStations } from '$lib/shared/stores/tubeStations';
  import user from '$lib/shared/stores/user';
  import type { TubeStationFormErrors } from '$lib/utilities/form';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import { afterUpdate, onMount } from 'svelte';

  export let data: { slug: string; tubeStation: TubeStationQueryResponse };
  export let me: User | null;
  const { slug } = data;
  async function checkForLoggedInUser() {
    if (!$user && browser) {
      if (me) {
        user.set({ ...me });
      } else {
        await prefetch('/login');
        await goto(`/login?next=tube-station/${slug}`);
      }
    }
  }

  onMount(() => {
    checkForLoggedInUser();
  });

  afterUpdate(() => {
    checkForLoggedInUser();
  });

  const index = $tubeStations.findIndex((element) => element.slug === slug);
  if (index >= 0) {
    tubeStations.set([
      ...$tubeStations.slice(0, index),
      data.tubeStation.tubeStation,
      ...$tubeStations.slice(index + 1)
    ]);
  } else {
    tubeStations.set([...$tubeStations, data.tubeStation.tubeStation]);
  }

  let tubeStation: TubeStation;
  $: tubeStation = $tubeStations.find((element) => element.slug === slug);
  $: id = tubeStation.id;
  $: name = tubeStation.name;
  $: updating = false;
  let errors: TubeStationFormErrors;
  $: errors = {};

  async function handleUpdate(input: UpdateTubeStationInput) {
    try {
      updating = true;
      const response = await fetch('/query/update/tube-station.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });
      const responseData = await response.json();

      const { errors: formErrors, tubeStation } = responseData.data.updateTubeStation;
      updating = false;
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

<nav aria-label="All tube stations">
  <a aria-label="See all tube stations" href="/tube-station" sveltekit:prefetch rel="external"
    >See all tube stations</a
  >
</nav>
{#if updating}
  <div>Updating...</div>
{/if}
<h1>{name}</h1>
<dl>
  <dt>Name</dt>
  <dd>
    <EditableText
      buttonLabel="Edit station name"
      value={name}
      id={`${slug}-edit-name`}
      placeholder={PLACEHOLDER_TEXT.tubeStationName}
      title={TITLE.tubeStationName}
      error={errors.name}
      on:update={(event) => {
        handleUpdate({ id, name: event.detail });
      }}
    />
  </dd>
  <dt>slug</dt>
  <dd>
    <EditableText
      buttonLabel="Edit station slug"
      value={slug}
      id={`${slug}-edit-slug`}
      placeholder={PLACEHOLDER_TEXT.slug}
      title={TITLE.slug}
      error={errors.slug}
      on:update={(event) => {
        handleUpdate({ id, slug: event.detail });
      }}
    />
  </dd>
</dl>
