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

      const response = await fetch('/query/exhibition.json', {
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
  // import CreateGallery from '$lib/components/CreateGallery.svelte';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import type { Exhibition, PaginatedExhibitions, User } from '$lib/generated/graphql';
  import dayjs from 'dayjs';
  import exhibitions from '$lib/shared/stores/exhibitions';
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
  import { N_DASH_ENTITY } from '$lib/constants/entities';

  export let data: { exhibitions: PaginatedExhibitions };
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
  let searchResults: Exhibition[];
  $: searchResults = search && searchQuery ? search.search(searchQuery) : $exhibitions;

  const today = dayjs(new Date());
  const aYearAgo = today.subtract(1, 'year');
  const aYearAhead = today.add(1, 'year');

  $: onNow = true;
  $: earliestEnd = onNow ? today : aYearAgo;
  $: latestStart = onNow ? today : aYearAhead;
  exhibitions.set(data.exhibitions.exhibitions);

  $: rebulidIndex;
  function rebulidIndex() {
    const dataToSearch = new JSSearch('id');

    dataToSearch.tokenizer = new StopWordsTokenizer(dataToSearch.tokenizer);
    dataToSearch.tokenizer = new StemmingTokenizer(stemmer, dataToSearch.tokenizer);
    dataToSearch.indexStrategy = new PrefixIndexStrategy();
    dataToSearch.sanitizer = new LowerCaseSanitizer();
    dataToSearch.searchIndex = new TfIdfSearchIndex('id');
    const indexBy = ['name', ['gallery', 'name']];

    onNow = onNow;
    indexBy.forEach((element) => {
      dataToSearch.addIndex(element);
    });
    dataToSearch.addDocuments([...$exhibitions]);
    search = dataToSearch;
  }

  $: filteredResults = [...searchResults].filter((element) => {
    const { start, end } = element;
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    return startDate <= latestStart && endDate >= earliestEnd;
  });

  onMount(() => {
    checkForLoggedInUser();
    rebulidIndex();
  });

  const dateFormat = 'dddd, DD-MMM-YYYY';
</script>

<SEO title="Exhibitions" {slug} metadescription="Exhibitions" />
<h1 id="exhibitions">Exhibitions</h1>
<label for="filter-exhibitions-on-now">On now?</label>
<input id="filter-exhibitions-on-now" type="checkbox" name="On now" bind:checked={onNow} />
<form on:submit|preventDefault={() => {}}>
  <TextInputField
    bind:value={searchQuery}
    id="exhibition-search"
    placeholder="Find an exhibition"
    title="Find an exhibition"
    style="width:100%"
  />
</form>
Showing {filteredResults.length} exhibitions.
<ul>
  {#each filteredResults as { id, name, start, end, freeEntry, online, inPerson, gallery, hashtags }}
  {@const galleryPage = `/gallery/${gallery.slug}`}
  {@const galleryName = gallery.name}
    <li>
      <h2>
        <a aria-label={`Open ${name} page`} sveltekit:prefetch href={`/exhibition/${id}`}>{name}</a>
      </h2>
      <dl>
        <dt>Runs</dt>
        <dd>{dayjs(start).format(dateFormat)}{N_DASH_ENTITY}{dayjs(end).format(dateFormat)}</dd>
        <dt>Gallery</dt>
        <dd>
          <a aria-label={`Open the ${galleryName} page`} href={galleryPage}
            >{galleryName}</a
          >
        </dd>
        <dt>Attendance</dt>
        <dd>
          {[...(online ? ['Online'] : []), ...(inPerson ? ['In person'] : [])].join(', ')}
        </dd>
        {#if hashtags.length}
          <dt>Hashtags</dt>
          <dd>
            {hashtags.join(', ')}
          </dd>{/if}
      </dl>
      {#if freeEntry}Free entry{/if}
    </li>
  {/each}
</ul>

