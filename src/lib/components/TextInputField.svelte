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
</script>

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
  />
</InputField>
