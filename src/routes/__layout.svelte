<script lang="ts">
  import Footer from '$lib/components/Layout/Footer.svelte';
  import Header from '$lib/components/Layout/Header.svelte';
  import PWA from '$lib/components/PWA.svelte';
</script>

<PWA />
<Header />
<main>
  <slot />
</main>
<Footer />
