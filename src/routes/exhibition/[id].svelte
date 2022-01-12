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
  import type { ExhibitionQueryResponse } from '$lib/generated/graphql';

  export let data: { exhibition: ExhibitionQueryResponse };
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
  <dt>Summary</dt>
  <dd>{summaryText}</dd>
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
