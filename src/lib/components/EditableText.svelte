<script lang="ts">
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import DoneIcon from '$lib/components/Icons/HappyFace.svelte';
  import ResetIcon from '$lib/components/Icons/SadFace.svelte';
  import InputField from '$lib/components/TextInputField.svelte';
  import { createEventDispatcher } from 'svelte';

  export let buttonLabel: string;
  export let value: string;
  export let id: string;
  export let placeholder: string;
  export let required: boolean = false;
  export let title: string;
  export let error: string;
  export let ariaLabel: string | null = null;
  export let href: string | null = null;

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
      dispatch('editing', false);
    }}><ResetIcon /></button
  >
  <button
    aria-label="Commit changes"
    type="button"
    on:click={() => {
      dispatch('update', value);
      dispatch('editing', false);
      editing = false;
    }}><DoneIcon /></button
  >
{:else}
  {#if href && ariaLabel}
    <a aria-label={ariaLabel} {href}>
      {value}
    </a>
  {:else}
    {value}
  {/if}
  <button
    aria-label={buttonLabel}
    type="button"
    on:click|stopPropagation={() => {
      editing = true;
      dispatch('editing', true);
    }}><EditIcon /></button
  >
{/if}
