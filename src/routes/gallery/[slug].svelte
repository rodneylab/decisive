<script context="module">
  export const load = async ({ fetch, page }) => {
    try {
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
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { GalleryQueryResponse } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
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

  $: gallery = $galleries.find((element) => element.slug === slug);
  $: id = gallery.id;
  $: address = gallery.address;
  $: name = gallery.name;
  $: openingTimes = gallery.openingTimes;
  $: website = gallery.website;
  $: updating = false;
  let errors: { name: string | undefined; streetAddress: string | undefined };
  $: errors = { name: undefined, streetAddress: undefined };

  async function handleUpdate(changes: { address?: string; website?: string }) {
    try {
      updating = true;
      const response = await fetch('/query/create/gallery.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          input: {
            ...changes
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, gallery } = responseData.data.createGallery;
      updating = false;
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
  <dd><a aria-label={`Open the ${name} website`} href={website}>{website}</a></dd>
</dl>
