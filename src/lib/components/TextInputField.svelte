<script lang="ts">
	import InputField from '$lib/components/InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let value: string;
	export let required: boolean = false;
	export let placeholder: string;
	export let id: string;
	export let title: string;
	export let error: string | null = null;
	export let dataList: string[] | null = null;
</script>

<h2>TextInputField component is deprecated, use @rodneylab/sveltekit-components instead</h2>
<InputField {id} {title} {error}>
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
		list={dataList ? `${id}-list` : null}
	/>
	{#if dataList}
		<datalist id={`${id}-list`}>
			{#each dataList as value}
				<option {value} />
			{/each}
		</datalist>
	{/if}
</InputField>
