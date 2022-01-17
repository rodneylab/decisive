<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';

  export const load = async ({ fetch, url }: LoadInput) => {
    try {
      const response = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include'
      });
      const { pathname } = url;
      return {
        props: { ...(await response.json()), pathname }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import Footer from '$lib/components/Layout/Footer.svelte';
  import Header from '$lib/components/Layout/Header.svelte';
  import PWA from '$lib/components/PWA.svelte';

  export let pathname: string;
  console.log('pathname: ', pathname);
</script>

<PWA />
<Header {pathname} />
<main>
  <slot />
</main>
<Footer />
