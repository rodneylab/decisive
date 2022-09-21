<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, prefetch } from '$app/navigation';
  import CreateGallery from '$lib/components/CreateGallery.svelte';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import type { Gallery, PaginatedGalleries, TubeStation, User } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import { tubeStations } from '$lib/shared/stores/tubeStations';
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

  export let data: { galleries: PaginatedGalleries; tubeStations: TubeStation[] };
  export let me: User | null;
  export let slug: string;

  tubeStations.set(data.tubeStations);

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
  let searchResults: Gallery[];
  $: searchResults = search && searchQuery ? search.search(searchQuery) : $galleries;

  galleries.set(data.galleries.galleries);

  $: rebulidIndex;
  function rebulidIndex() {
    const dataToSearch = new JSSearch('slug');

    dataToSearch.tokenizer = new StopWordsTokenizer(dataToSearch.tokenizer);
    dataToSearch.tokenizer = new StemmingTokenizer(stemmer, dataToSearch.tokenizer);
    dataToSearch.indexStrategy = new PrefixIndexStrategy();
    dataToSearch.sanitizer = new LowerCaseSanitizer();
    dataToSearch.searchIndex = new TfIdfSearchIndex('slug');
    const indexBy = ['name', 'address'];

    indexBy.forEach((element) => {
      dataToSearch.addIndex(element);
    });
    dataToSearch.addDocuments([...$galleries]);
    search = dataToSearch;
  }

  onMount(() => {
    checkForLoggedInUser();
    rebulidIndex();
  });

  async function handleDelete(id: string) {
    try {
      const response = await fetch('/query/delete/gallery.json', {
        method: 'POST',
        credentials: 'include',
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
<a href="/gallery#create-gallery">Create a new gallery</a>
<h1 id="galleries">Galleries</h1>
<form on:submit|preventDefault={() => {}}>
  <TextInputField
    bind:value={searchQuery}
    id="gallery-search"
    placeholder="Find a gallery"
    title="Find a gallery"
    style="width:100%"
  />
</form>
<ul>
  {#each searchResults as { byAppointmentOpeningTimes, id, name, address, openingTimes, slug, website, websiteUrl }}
    <li>
      <h2>
        <a aria-label={`Open ${name} page`} data-sveltekit-prefetch href={`/gallery/${slug}`}
          >{name}</a
        >
      </h2>
      <dl>
        {#if address}
          <dt>Address</dt>
          <dd>{address}</dd>
        {/if}
        {#if openingTimes}
          <dt>Opening times</dt>
          <dd>{openingTimes}</dd>
        {/if}
        {#if byAppointmentOpeningTimes}
          <dt>By appointment opening times</dt>
          <dd>{byAppointmentOpeningTimes}</dd>
        {/if}

        <dt>website</dt>
        <dd><a aria-label={`Open the ${name} website`} href={websiteUrl}>{website}</a></dd>
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
<a href="/gallery#galleries">back to top</a>
<CreateGallery tubeStationsNames={$tubeStations.map((element) => element.name)} />
