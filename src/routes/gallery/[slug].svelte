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
      const { slug } = page.params;
      const response = await fetch(`/query/gallery/${slug}.json`, {
        method: 'POST',
        credentials: 'include'
      });
      return {
        props: { ...(await response.json()), ...data, slug }
      };
    } catch (error) {
      console.error(`Error in load function for /gallery/[slug]: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import EditableText from '$lib/components/EditableText.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { Gallery, GalleryQueryResponse, User } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import user from '$lib/shared/stores/user';
  import type { GalleryFormErrors } from '$lib/utilities/form';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import { Map } from '@rodneylab/sveltekit-components';
  import { afterUpdate, onMount } from 'svelte';

  export let slug: string;
  export let data: { gallery: GalleryQueryResponse };
  export let me: User | null;

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

  afterUpdate(() => {
    checkForLoggedInUser();
  });

  const index = $galleries.findIndex((element) => element.slug === slug);
  if (index >= 0) {
    galleries.set([
      ...$galleries.slice(0, index),
      data.gallery.gallery,
      ...$galleries.slice(index + 1)
    ]);
  } else {
    galleries.set([...$galleries, data.gallery.gallery]);
  }

  let gallery: Gallery;
  $: gallery = $galleries.find((element) => element.slug === slug);
  $: id = gallery.id;
  $: address = gallery.address;
  $: name = gallery.name;
  $: openingTimes = gallery.openingTimes;
  $: website = gallery.website;
  $: websiteUrl = gallery.websiteUrl;
  $: location = gallery.location;
  $: openStreetMap = gallery.openStreetMap;
  $: updating = false;
  $: locality = gallery.postalAddress.locality;
  let errors: GalleryFormErrors;
  $: errors = {};

  async function handleUpdate(changes: {
    address?: string;
    openStreetMapUrl?: string;
    website?: string;
  }) {
    try {
      updating = true;
      const response = await fetch('/query/update/gallery.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            id,
            ...changes
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, gallery } = responseData.data.updateGallery;
      updating = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        galleries.set([...$galleries, gallery]);
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in UpdateGallery: ${error}`);
    }
  }
</script>

<!-- <pre>{JSON.stringify(gallery, null, 2)}</pre> -->
<nav aria-label="All galleries">
  <a aria-label="See all galleries" href="/gallery" sveltekit:prefetch rel="external"
    >See all galleries</a
  >
</nav>
{#if updating}
  <div>Updating...</div>
{/if}
<h1>{name}</h1>
<dl>
  <dt>Address</dt>
  <dd>
    <EditableText
      buttonLabel="Edit gallery address"
      value={address}
      id={`${slug}-edit-address`}
      placeholder={PLACEHOLDER_TEXT.streetAddress}
      title={TITLE.streetAddress}
      error={errors.streetAddress}
      on:update={(event) => {
        handleUpdate({ address: event.detail });
      }}
    />
  </dd>
  {#if openingTimes}
    <dt>Opening times</dt>
    <dd>{openingTimes}</dd>
  {/if}
  <dt>website</dt>
  <dd>
    <EditableText
      ariaLabel={`Open the ${name} website`}
      href={websiteUrl}
      buttonLabel="Edit gallery website URL"
      value={website}
      id={`${slug}-edit-website`}
      placeholder={PLACEHOLDER_TEXT.website}
      title={TITLE.website}
      error={errors.website}
      on:update={(event) => {
        handleUpdate({ website: event.detail });
      }}
    />
  </dd>
  <dt>map</dt>
  <dd>
    <EditableText
      buttonLabel="Edit gallery map"
      value={openStreetMap ? openStreetMap : 'No map yet'}
      id={`${slug}-edit-map`}
      placeholder={PLACEHOLDER_TEXT.openStreetMap}
      title={TITLE.openStreetMap}
      error={errors.openStreetMap}
      on:update={(event) => {
        handleUpdate({ openStreetMapUrl: event.detail });
      }}
    />
  </dd>
</dl>
{#if location}
  <Map
    {location}
    id={`${slug}-map`}
    style="width:100%;height:25rem"
    marker
    markerMarkup={`<strong>${name}</strong><br/>${locality}`}
  />
{/if}
