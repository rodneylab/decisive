<script context="module" lang="ts">
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
      const { slug } = params;
      const response = await fetch(`/query/photographer/${slug}.json`, {
        method: 'POST',
        credentials: 'include'
      });
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
  import type { Photographer, PhotographerQueryResponse, User } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import photographers from '$lib/shared/stores/photographers';
  import user from '$lib/shared/stores/user';
  import type { LoadInput } from '@sveltejs/kit';
  import { afterUpdate, onMount } from 'svelte';

  export let slug: string;
  export let data: { photographer: PhotographerQueryResponse };
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

  const index = $photographers.findIndex((element) => element.slug === slug);
  if (index >= 0) {
    galleries.set([
      ...$galleries.slice(0, index),
      data.photographer.photographer,
      ...$photographers.slice(index + 1)
    ]);
  } else {
    galleries.set([...$photographers, data.photographer.photographer]);
  }

  let photographer: Photographer;
  $: photographer = $galleries.find((element) => element.slug === slug);
  $: name = photographer.name;
  $: website = photographer.website;
  $: websiteUrl = photographer.websiteUrl;
  $: updating = false;
</script>

<nav aria-label="All galleries">
  <a aria-label="See all galleries" href="/gallery" sveltekit:prefetch>See all galleries</a>
</nav>
{#if updating}
  <div>Updating...</div>
{/if}
<h2>
  <a aria-label={`Open ${name} page`} sveltekit:prefetch href={`/photographer/${slug}`}>{name}</a>
</h2>
{#if website}
  <dl>
    <dt>Website</dt>
    <dd>
      <a aria-label={`Open ${name} website`} href={websiteUrl}>{website}</a>
    </dd>
  </dl>{/if}
