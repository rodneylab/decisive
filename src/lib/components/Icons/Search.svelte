<script lang="ts">
	import 'iconify-icon';
	import { addCollection } from 'iconify-icon';

	export let colour: string = undefined;
	export let label: string = 'search icon';
	export let width: number = 16;
	export let height: number = width;
	export let ariaHidden: boolean = false;

	const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

	addCollection({
		prefix: 'fa-solid',
		icons: {
			search: {
				body: '<path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128c0-70.7 57.2-128 128-128c70.7 0 128 57.2 128 128c0 70.7-57.2 128-128 128z"/>'
			}
		},
		width: 512,
		height: 512
	});

	// https://api.iconify.design/fa-solid.json?icons=search
</script>

<iconify-icon
	style:color={colour}
	role="img"
	{id}
	aria-label={label}
	{ariaHidden}
	icon="fa-solid:search"
	{width}
	{height}
/>
