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

      const response = await fetch('/query/gallery.json', {
        method: 'POST',
        credentials: 'include'
      });
      const { slug } = page.params;
      return {
        props: { ...(await response.json()), slug, ...data }
      };
    } catch (error) {
      console.error(`Error in load function for /gallery: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import CreateGallery from '$lib/components/CreateGallery.svelte';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import type { PaginatedGalleries, User } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import user from '$lib/shared/stores/user';
  import { onMount } from 'svelte';

  export let data: { galleries: PaginatedGalleries };
  export let me: User | null;
  export let slug: string;

  async function checkForLoggedInUser() {
    if (browser) {
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

  galleries.set(data.galleries.galleries);

  async function handleDelete(id: string) {
    try {
      const response = await fetch('/query/delete/gallery.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const responseData = await response.json();
      const { deleteGallery: deleted } = responseData.data.data;
      console.log('Deleted? : ', deleted);
      const index = $galleries.findIndex((element) => element.id === id);
      galleries.set([...$galleries.slice(0, index), ...$galleries.slice(index + 1)]);
    } catch (error) {
      console.error(`Error in handleDelete function in /gallery: ${error}`);
    }
  }

  async function handleEdit(slug: string) {
    await prefetch(`/gallery/${slug}`);
    goto(`gallery/${slug}`);
  }
</script>

<SEO title="Galleries" {slug} metadescription="Galleries" />
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<h1>Galleries</h1>
<ul>
  {#each $galleries as { id, name, address, openingTimes, slug, website }}
    <li>
      <h2>
        <a aria-label={`Open ${name} page`} sveltekit:prefetch href={`/gallery/${slug}`}>{name}</a>
      </h2>
      <dl>
        <dt>Address</dt>
        <dd>{address}</dd>
        {#if openingTimes}
          <dt>Opening times</dt>
          <dd>{openingTimes}</dd>
        {/if}
        <dt>website</dt>
        <dd><a aria-label={`Open the ${name} website`} href={website}>{website}</a></dd>
      </dl>
      <button
        aria-label="Edit gallery"
        on:click={() => {
          handleEdit(slug);
        }}><EditIcon /></button
      ><button aria-label="Delete gallery" type="button" on:click={() => handleDelete(id)}
        ><DeleteIcon /></button
      >
    </li>
  {/each}
</ul>

<h2>Add a New Gallery</h2>
<CreateGallery />
