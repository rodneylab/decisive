<script context="module">
  export const load = async ({ fetch }) => {
    try {
      const response = await fetch('/query/gallery.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        props: { ...(await response.json()) }
      };
    } catch (error) {
      console.error(`Error in load function for /gallery: ${error}`);
    }
  };
</script>

<script lang="ts">
  export let data;
  const { galleries } = data.galleries;
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
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
