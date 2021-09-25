<script context="module">
  export function load({ error, status }) {
    const { message } = error;
    return { props: { status, message } };
  }
</script>

<script>
  import SEO from '$lib/components/SEO/index.svelte';

  export let message;
  export let status;

  const title = 'Page not found';
</script>

<SEO metadescription="Page not found" slug="" {title} />
<h1>{status} Error: {message}</h1>
