<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let value: string;
	export let required: boolean = false;
	export let id: string;
	export let placeholder: string;
	export let title: string;
	export let error: string | null = null;
</script>

<span class="screen-reader-text"><label for={id}>{title}</label></span>
<input
	bind:value
	on:change={() => {
		dispatch('update', value);
	}}
	{required}
	{id}
	{placeholder}
	{title}
	type="text"
	spellcheck
	list="day"
/>
<datalist id="day">
	<option value="Sunday" />
	<option value="Monday" />
	<option value="Tuesday" />
	<option value="Wednesday" />
	<option value="Thursday" />
	<option value="Friday" />
	<option value="Saturday" />
</datalist>
{#if error}
	<small class="error-text">{error}</small>
{/if}

<style>
	.screen-reader-text {
		border: 0;
		clip: rect(1px, 1px, 1px, 1px);
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		width: 1px;
		overflow: hidden;
		position: absolute !important;
		word-wrap: normal !important;
	}
	.error-text {
		color: #c42021;
	}
</style>
