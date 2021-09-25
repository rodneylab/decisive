<script context="module">
  import SEO from '$lib/components/SEO/index.svelte';

  export const load = async ({ fetch, page }) => {
    try {
      const response = await fetch('/query/gallery.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { slug } = page.params;
      return {
        props: { ...(await response.json()), slug }
      };
    } catch (error) {
      console.error(`Error in load function for /gallery: ${error}`);
    }
  };
</script>

<script lang="ts">
  export let data;
  export let slug;
  const { galleries } = data.galleries;
</script>

<SEO title="Tube Stations" {slug} metadescription="Tube Stations" />
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<h1>Galleries</h1>
<ul>
  {#each galleries as { name, address, openingTimes, website }}
    <li>
      <h2>{name}</h2>
      <dl>
        <dt>Address</dt>
        <dd>{address}</dd>
        <dt>Opening times</dt>
        <dd>{openingTimes}</dd>
        <dt>website</dt>
        <dd><a aria-label={`Open the ${name} website`} href={website}>{website}</a></dd>
      </dl>
    </li>
  {/each}
</ul>
