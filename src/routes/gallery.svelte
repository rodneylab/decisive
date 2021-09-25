<script context="module">
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
  import CreateGallery from '$lib/components/CreateGallery.svelte';
  import DeleteIcon from '$lib/components/Icons/Delete.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import galleries from '$lib/shared/stores/galleries';
  export let data;
  export let slug;

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
</script>

<SEO title="Galleries" {slug} metadescription="Galleries" />
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<h1>Galleries</h1>
<ul>
  {#each $galleries as { id, name, address, openingTimes, website }}
    <li>
      <h2>{name}</h2>
      <dl>
        <dt>Address</dt>
        <dd>{address}</dd>
        {#if openingTimes}
          <dt>Opening times</dt>
          <dd>{openingTimes}</dd>
        {/if}
        <dt>website</dt>
        <dd><a aria-label={`Open the ${name} website`} href={website}>{website}</a></dd>
        <EditIcon /><button
          aria-label="Delete station"
          type="button"
          on:click={() => handleDelete(id)}><DeleteIcon /></button
        >
      </dl>
    </li>
  {/each}
</ul>

<h2>Add a New Gallery</h2>
<CreateGallery />
