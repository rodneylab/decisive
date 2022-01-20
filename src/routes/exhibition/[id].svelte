<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';
  import { TextArea } from '@rodneylab/sveltekit-components';
  import { browser } from '$app/env';

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
      const { id } = params;
      const response = await fetch(`/query/exhibition/${id}.json`, {
        method: 'POST',
        credentials: 'include'
      });

      const photographerResponse = await fetch('/query/photographer.json', {
        method: 'POST',
        credentials: 'same-origin'
      });
      const photographerData = await photographerResponse.json();

      return {
        props: { data: { ...(await response.json()).data, ...photographerData.data }, ...data, id }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import dayjs from 'dayjs';
  import type {
    ExhibitionQueryResponse,
    PaginatedPhotographers,
    UpdateExhibitionInput
  } from '$lib/generated/graphql';
  import { parse } from 'marked';
  import SaveIcon from '$lib/components/Icons/Save.svelte';
  import photographersStore from '$lib/shared/stores/photographers';
  import LessIcon from '$lib/components/Icons/Less.svelte';
  import EditableText from '$lib/components/EditableText.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';

  export let data: { exhibition: ExhibitionQueryResponse; photographers: PaginatedPhotographers };
  export let id: string;

  photographersStore.set(data.photographers.photographers);
  $: photographerNames = $photographersStore.map((element) => element.name);
  let {
    description,
    end,
    freeEntry,
    gallery,
    hashtags,
    inPerson,
    name,
    online,
    photographers,
    start,
    summaryText
  } = data.exhibition.exhibition;

  let { name: galleryName, slug: gallerySlug } = gallery;
  const dateFormat = 'dddd, DD-MMM-YYYY';

  $: updating = false;
  let newPhotographerSlug: string = '';

  function sessionStore(field: string, value: string) {
    browser && window.sessionStorage.setItem(`edit-exhibition-${field}}`, value);
  }

  async function handleUpdate(changes: UpdateExhibitionInput) {
    try {
      updating = true;
      const response = await fetch('/query/update/exhibition.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            ...changes
          }
        })
      });
      const responseData = await response.json();
      updating = false;
    } catch (error) {
      console.error(`Error in handleSubmit function in UpdateGallery: ${error}`);
    }
  }
</script>

<h1>{name}</h1>
<dl>
  <dt>Gallery</dt>
  <dd>
    <a aria-label={`Open the ${galleryName} page`} href={`/gallery/${gallerySlug}`}>{galleryName}</a
    >
  </dd>
  <dt>Photographers</dt>
  {#each photographers as { name: photographerName, slug: photographerSlug }}
    <a aria-label={`Jump to ${photographerName} page`} href={`/photographer/${photographerSlug}`}
      >{photographerName}</a
    >
    <button
      aria-label="Remove this station"
      on:click|preventDefault={() => {
        handleUpdate({ id, removePhotographers: [photographerName] });
      }}><LessIcon /></button
    >
  {:else}
    No photographers added yet
  {/each}
  <EditableText
    buttonLabel="Add an existing photographer to exhibition photographers"
    value={newPhotographerSlug}
    id={`${id}-new-photographer`}
    placeholder={PLACEHOLDER_TEXT.photographerName}
    dataList={photographerNames}
    error={null}
    title={TITLE.photographerName}
    on:update={(event) => {
      newPhotographerSlug = $photographersStore.find(
        (element) => element.name === event.detail
      ).slug;
      console.log('slug: ', newPhotographerSlug);
      handleUpdate({ id, addPhotographers: [newPhotographerSlug] });
    }}
  />
  <dt>Start date</dt>
  <dd>{dayjs(start).format(dateFormat)}</dd>
  <dt>End date</dt>
  <dd>{dayjs(end).format(dateFormat)}</dd>
  <dt>Description</dt>
  <dd>{description}</dd>
  <dt>Attendance</dt>
  <dd>
    {[...(online ? ['Online'] : []), ...(inPerson ? ['In person'] : [])].join(', ')}
  </dd>
  {#if hashtags.length}
    <dt>Hashtags</dt>
    <dd>
      {hashtags.join(', ')}
    </dd>{/if}
  {#if freeEntry}Free entry{/if}
</dl>
<h2>Summary</h2>
<button
  on:click|preventDefault={() => {
    handleUpdate({ id, summaryText });
  }}><SaveIcon /><span class="screen-reader-text">Save changes</span></button
>
<TextArea
  value={summaryText}
  id="edit-exhibition-summary"
  rows={2}
  placeholder="Exhibition sumary"
  title="Exhibition summary"
  error={null}
  on:update={(event) => {
    const { detail } = event;
    sessionStore('summary', detail);
    summaryText = detail;
  }}
/>
<div>
  {@html parse(summaryText)}
</div>
