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

      const response = await fetch('/query/photographer.json', {
        method: 'POST',
        credentials: 'include'
      });
      const { slug } = params;
      return {
        props: {
          data: { ...(await response.json()).data, slug },
          ...data
        }
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
  import SEO from '$lib/components/SEO/index.svelte';
  import type { PaginatedPhotographers, Photographer, User } from '$lib/generated/graphql';
  import photographers from '$lib/shared/stores/photographers';
  import user from '$lib/shared/stores/user';
  import { onMount } from 'svelte';
  import {
    LowerCaseSanitizer,
    PrefixIndexStrategy,
    Search as JSSearch,
    StemmingTokenizer,
    StopWordsTokenizer,
    TfIdfSearchIndex
  } from 'js-search';
  import { stemmer } from 'stemmer';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import CreatePhotographer from '$lib/components/CreatePhotographer.svelte';
  import slugify from 'slugify';

  export let data: { photographers: PaginatedPhotographers };
  export let me: User | null;
  export let slug: string;

  async function checkForLoggedInUser() {
    if (!user && browser) {
      if (me) {
        user.set({ ...me });
      } else {
        await prefetch('/login');
        await goto('/login');
      }
    }
  }

  $: searchQuery = '';
  $: search = null;
  let searchResults: Photographer[];
  $: searchResults = search && searchQuery ? search.search(searchQuery) : $photographers;

  photographers.set(data.photographers.photographers);

  $: rebulidIndex;
  function rebulidIndex() {
    const dataToSearch = new JSSearch('id');

    dataToSearch.tokenizer = new StopWordsTokenizer(dataToSearch.tokenizer);
    dataToSearch.tokenizer = new StemmingTokenizer(stemmer, dataToSearch.tokenizer);
    dataToSearch.indexStrategy = new PrefixIndexStrategy();
    dataToSearch.sanitizer = new LowerCaseSanitizer();
    dataToSearch.searchIndex = new TfIdfSearchIndex('id');
    const indexBy = ['name', ['gallery', 'name']];

    indexBy.forEach((element) => {
      dataToSearch.addIndex(element);
    });
    dataToSearch.addDocuments([...$photographers]);
    search = dataToSearch;
  }

  onMount(() => {
    checkForLoggedInUser();
    rebulidIndex();
  });
</script>

<SEO title="Photographers" {slug} metadescription="Photographers" />
<h1 id="photographers">Photographers</h1>
<form on:submit|preventDefault={() => {}}>
  <TextInputField
    bind:value={searchQuery}
    id="photographer-search"
    placeholder="Find a photographer"
    title="Find an photographer"
    style="width:100%"
  />
</form>
Showing {searchResults.length} photographer{searchResults.length !== 1 ? 's' : ''}.
<ul>
  {#each searchResults as { name, slug, website, websiteUrl }}
    <li>
      <h2>
        <a aria-label={`Open ${name} page`} sveltekit:prefetch href={`/photographer/${slug}`}
          >{name}</a
        >
      </h2>
      {#if website}
        <dl>
          <dt>Website</dt>
          <dd>
            <a aria-label={`Open ${name} website`} href={websiteUrl}>{website}</a>
          </dd>
        </dl>{/if}
    </li>
  {/each}
</ul>

<h3>Add a New Photographer</h3>
<CreatePhotographer />
