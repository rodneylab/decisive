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
      return {
        props: { ...(await response.json()), ...data, id }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import dayjs from 'dayjs';
  import type { ExhibitionQueryResponse, UpdateExhibitionInput } from '$lib/generated/graphql';
  import { parse } from 'marked';
  import SaveIcon from '$lib/components/Icons/Save.svelte';

  export let data: { exhibition: ExhibitionQueryResponse };
  export let id: string;
  let {
    description,
    end,
    freeEntry,
    gallery,
    hashtags,
    inPerson,
    name,
    online,
    start,
    summaryText
  } = data.exhibition.exhibition;
  let { name: galleryName, slug: gallerySlug } = gallery;
  const dateFormat = 'dddd, DD-MMM-YYYY';

  $: updating = false;

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
