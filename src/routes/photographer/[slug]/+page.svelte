<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, prefetch } from '$app/navigation';
  import type { Photographer } from '$lib/generated/graphql';
  import photographers from '$lib/shared/stores/photographers';
  import user from '$lib/shared/stores/user';
  import { afterUpdate, onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { me, slug } = data;

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

  const index = $photographers.findIndex((element) => element.slug === slug);
  if (index >= 0) {
    photographers.set([
      ...$photographers.slice(0, index),
      data.photographer.photographer,
      ...$photographers.slice(index + 1)
    ]);
  } else {
    photographers.set([...$photographers, data.photographer.photographer]);
  }

  let photographer: Photographer;
  $: photographer = $photographers.find((element) => element.slug === slug);
  $: name = photographer.name;
  $: website = photographer.website;
  $: websiteUrl = photographer.websiteUrl;
  $: exhibitions = photographer.exhibitions;
  $: updating = false;
</script>

<nav aria-label="All photographers">
  <a aria-label="See all photographers" href="/photographer" data-sveltekit-prefetch
    >See all photographers</a
  >
</nav>
{#if updating}
  <div>Updating...</div>
{/if}
<h2>
  <a aria-label={`Open ${name} page`} data-sveltekit-prefetch href={`/photographer/${slug}`}
    >{name}</a
  >
</h2>
<dl>
  {#if website}
    <dt>Website</dt>
    <dd>
      <a aria-label={`Open ${name} website`} href={websiteUrl}>{website}</a>
    </dd>
  {/if}
  <dt>Exhibitions</dt>
  <dd>
    <ul>
      {#each exhibitions as { name: exhibitionName, id }}
        <li>
          <a aria-label={`Jump to ${name} exhibition`} href={`/exhibition/${id}`}
            >{exhibitionName}</a
          >
        </li>
      {/each}
    </ul>
  </dd>
</dl>
