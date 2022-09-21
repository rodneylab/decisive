<script lang="ts">
  import 'iconify-icon';
  import { addCollection } from 'iconify-icon';

  export let colour: string = undefined;
  export let label: string = 'edit icon';
  export let width: number = 16;
  export let height: number = width;
  export let ariaHidden: boolean = false;

  const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

  addCollection({
    prefix: 'fa-solid',
    icons: {
      'pencil-alt': {
        body: '<path fill="currentColor" d="m497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4L.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3l262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3l-31.1-31.1L51.7 376H88v48z"/>'
      }
    },
    width: 512,
    height: 512
  });

  // https://api.iconify.design/fa-solid.json?icons=pencil-alt
</script>

<iconify-icon
  style:color={colour}
  role="img"
  {id}
  aria-label={label}
  {ariaHidden}
  icon="fa-solid:pencil-alt"
  {width}
  {height}
/>
