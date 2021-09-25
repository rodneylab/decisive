<script lang="ts">
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import DoneIcon from '$lib/components/Icons/HappyFace.svelte';
  import ResetIcon from '$lib/components/Icons/SadFace.svelte';
  import InputField from '$lib/components/InputField.svelte';
  import { createEventDispatcher } from 'svelte';

  export let buttonLabel: string;
  export let value: string;
  export let id: string;
  export let placeholder: string;
  export let required: boolean = false;
  export let title;
  export let error;

  const dispatch = createEventDispatcher();

  $: editing = false;
</script>

{#if editing}
  <InputField
    {value}
    {id}
    {placeholder}
    {required}
    {title}
    {error}
    on:update={(event) => {
      value = event.detail;
    }}
  />
  <button
    aria-label="Revert changes"
    type="button"
    on:click={() => {
      editing = false;
    }}><ResetIcon /></button
  >
  <button
    aria-label="Commit changes"
    type="button"
    on:click={() => {
      dispatch('update', value);
      editing = false;
    }}><DoneIcon /></button
  >
{:else}
  {value}
  <button
    aria-label={buttonLabel}
    type="button"
    on:click={() => {
      editing = true;
    }}><EditIcon /></button
  >
{/if}
