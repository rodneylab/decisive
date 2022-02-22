<script lang="ts">
  import Icon, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';

  export let colour: string = undefined;
  export let label: string = 'less / fewer icon';
  export let width: number = 16;
  export let height: number = width;
  export let ariaHidden: boolean = false;

  const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

  addCollection({
    prefix: 'fa-solid',
    icons: {
      'minus-circle': {
        body: '<path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248s248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/>'
      }
    },
    width: 512,
    height: 512
  });

  // https://api.iconify.design/fa-solid.json?icons=minus-circle
</script>

<Icon
  {id}
  aria-label={label}
  {ariaHidden}
  icon="fa-solid:minus-circle"
  {width}
  {height}
  color={colour}
/>
