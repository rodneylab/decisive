<script lang="ts">
  import 'iconify-icon';
  import { addCollection } from 'iconify-icon';

  export let colour: string = undefined;
  export let label: string = 'more icon';
  export let width: number = 16;
  export let height: number = width;
  export let ariaHidden: boolean = false;

  const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

  addCollection({
    prefix: 'fa-solid',
    icons: {
      'plus-circle': {
        body: '<path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248s248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"/>'
      }
    },
    width: 512,
    height: 512
  });

  // https://api.iconify.design/fa-solid.json?icons=plus-circle
</script>

<iconify-icon
  style:color={colour}
  role="img"
  {id}
  aria-label={label}
  {ariaHidden}
  icon="fa-solid:plus-circle"
  {width}
  {height}
/>
