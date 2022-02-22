<script lang="ts">
  import Icon, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte';

  export let colour: string = undefined;
  export let label: string = 'save icon';
  export let width: number = 16;
  export let height: number = width;
  export let ariaHidden: boolean = false;

  const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

  addCollection({
    prefix: 'fa-solid',
    icons: {
      save: {
        body: '<path fill="currentColor" d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64c0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/>',
        width: 448
      }
    },
    width: 512,
    height: 512
  });

  // https://api.iconify.design/fa-solid.json?icons=save
</script>

<Icon {id} aria-label={label} {ariaHidden} icon="fa-solid:save" {width} {height} color={colour} />
