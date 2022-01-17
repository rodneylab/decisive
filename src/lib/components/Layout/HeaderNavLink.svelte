<script lang="ts">
  export let href: string;
  export let label: string;
  export let pathname: string;
  export let text: string;
</script>

{#if pathname !== href}
  <a aria-label={label} {href}>{text}</a>
{:else}
  {text}
{/if}
