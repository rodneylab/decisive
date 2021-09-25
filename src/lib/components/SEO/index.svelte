<script lang="ts">
  import website from '$lib/config/website';
  import { VERTICAL_LINE_ENTITY } from '$lib/constants/entities';

  const { siteLanguage, siteTitle, siteUrl } = website;

  export let metadescription;
  export let slug;
  export let title;

  const pageTitle = `${siteTitle} ${VERTICAL_LINE_ENTITY} ${title}`;
  const url = `${siteUrl}/${slug}`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={metadescription} />
  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  />
  <html lang={siteLanguage} />
  <link rel="canonical" href={url} />
</svelte:head>
