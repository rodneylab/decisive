<script lang="ts">
	import 'iconify-icon';
	import { addCollection } from 'iconify-icon';

	export let colour: string = undefined;
	export let label: string = 'undo icon';
	export let width: number = 16;
	export let height: number = width;
	export let ariaHidden: boolean = false;

	const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

	addCollection({
		prefix: 'fa-solid',
		icons: {
			undo: {
				body: '<path fill="currentColor" d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215c-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176c0-97.267-78.716-176-176-176c-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"/>'
			}
		},
		width: 512,
		height: 512
	});

	// https://api.iconify.design/fa-solid.json?icons=undo
</script>

<iconify-icon
	style:color={colour}
	role="img"
	{id}
	aria-label={label}
	{ariaHidden}
	icon="fa-solid:undo"
	{width}
	{height}
/>
