<script lang="ts">
  import SEO from '$lib/components/SEO/index.svelte';
  import { page } from '$app/stores';

  const {
    error: { message },
    status
  } = $page;

  const title = 'Page not found';
</script>

<SEO metadescription="Page not found" slug="" {title} />
<h1>{status} Error: {message}</h1>
