<script lang="ts">
	import 'iconify-icon';
	import { addCollection } from 'iconify-icon';

	export let colour: string = undefined;
	export let label: string = 'litter bin icon';
	export let width: number = 16;
	export let height: number = width;
	export let ariaHidden: boolean = false;

	const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);

	addCollection({
		prefix: 'fa-regular',
		icons: {
			'trash-alt': {
				body: '<path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"/>',
				width: 448
			}
		},
		width: 512,
		height: 512
	});

	// https://api.iconify.design/fa-regular.json?icons=trash-alt
</script>

<iconify-icon
	style:color={colour}
	role="img"
	{id}
	aria-label={label}
	{ariaHidden}
	icon="fa-regular:trash-alt"
	{width}
	{height}
/>
