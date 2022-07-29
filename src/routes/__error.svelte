<script context="module" lang="ts">
  import type { Load } from './__types/__error';

  export const load: Load = function load({ error, status }) {
    const { message } = error;
    return { props: { status, message } };
  };
</script>

<script lang="ts">
  import SEO from '$lib/components/SEO/index.svelte';

  export let message: string;
  export let status: number;

  const title = 'Page not found';
</script>

<SEO metadescription="Page not found" slug="" {title} />
<h1>{status} Error: {message}</h1>
