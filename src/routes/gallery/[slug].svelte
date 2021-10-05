<script context="module">
  export const load = async ({ fetch, page }) => {
    try {
      // check for valid user session
      const meResponse = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
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
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        props: { ...(await response.json()), slug }
      };
    } catch (error) {
      console.error(`Error in load function for /gallery/[slug]: ${error}`);
    }
  };
</script>

<script lang="ts">
  import EditableText from '$lib/components/EditableText.svelte';
  import Map from '$lib/components/Map.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { Gallery, GalleryQueryResponse } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import type { GalleryFormErrors } from '$lib/utilities/form';
  import { mapErrorsToFields } from '$lib/utilities/form';

  export let slug: string;
  export let data: { gallery: GalleryQueryResponse };

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
  $: location = gallery.location;
  $: openStreetMap = gallery.openStreetMap;
  $: updating = false;
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
        credentials: 'same-origin',
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
      href={website}
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

<Map {location} id={`${slug}-map`} />
