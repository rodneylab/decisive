<script lang="ts">
  import { browser } from '$app/env';
  import DayInputField from '$lib/components/DayInputField.svelte';
  import EditIcon from '$lib/components/Icons/Edit.svelte';
  import LessIcon from '$lib/components/Icons/Less.svelte';
  import MoreIcon from '$lib/components/Icons/More.svelte';
  import SaveIcon from '$lib/components/Icons/Save.svelte';
  import UndoIcon from '$lib/components/Icons/Undo.svelte';
  import { DEFAULT_NEW_OPENING_HOURS } from '$lib/constants/form';
  import { DAYS } from '$lib/constants/time';
  import type {
    Mutation,
    OpeningHoursRangeInput,
    UpdateGalleryInput
  } from '$lib/generated/graphql';
  import galleries from '$lib/shared/stores/galleries';
  import { GalleryFormErrors, mapErrorsToFields } from '$lib/utilities/form';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import { tick } from 'svelte';

  export let id: string;
  export let openingTimes: string;
  export let openingHoursRanges: OpeningHoursRangeInput[];
  export let text: string = 'Opening times';
  export let type: 'by-appointment' | 'default' = 'default';

  let errors: GalleryFormErrors;
  $: errors = {};
  $: editOpeningHours = false;
  $: idStringBase = `edit-gallery${type === 'default' ? '' : `-${type}`}-opening`;
  $: newOpeningHours = openingHoursRanges.map((element) => {
    const { startDay, endDay, openingTime, closingTime } = element;
    return { startDay, endDay, openingTime, closingTime };
  });

  function handleFewerOpeningHours(index: number) {
    newOpeningHours = [...newOpeningHours.slice(0, index), ...newOpeningHours.slice(index + 1)];
  }

  $: handleMoreOpeningHours;
  async function handleMoreOpeningHours() {
    try {
      const template = newOpeningHours.at(-1) ?? DEFAULT_NEW_OPENING_HOURS;
      const startDay = Math.min(6, template.endDay + 1);
      const { closingTime, openingTime } = template;
      newOpeningHours = [...newOpeningHours, { startDay, endDay: 6, openingTime, closingTime }];
      if (browser) {
        await tick();
        document.getElementById(`${idStringBase}-start-${newOpeningHours.length - 1}`).focus();
      }
    } catch (error) {
      console.error(`Error in handleMoreOpeningHours function in CreateGallery`);
    }
  }

  // todo(rodneylab): refactor to utilities as a single function called by all similar components
  async function handleUpdate(changes: UpdateGalleryInput) {
    try {
      //   updating = true;
      const response = await fetch('/query/update/gallery.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            ...changes
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, gallery }: Mutation['updateGallery'] =
        responseData.data.updateGallery;
      //   updating = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        galleries.set([...$galleries, gallery]);
        if (changes.replacementOpeningHours) {
          openingTimes = gallery.openingTimes;
        }
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in UpdateGallery: ${error}`);
    }
  }

  function handleUndoByAppointmentOpeningHoursChanges() {
    newOpeningHours = openingHoursRanges;
    editOpeningHours = false;
  }
  async function handleUpdateOpeningHours() {
    const filteredOpeningHours = newOpeningHours.filter(
      (element) => element.startDay !== -1 && element.endDay !== -1
    );
    if (type === 'default') {
      await handleUpdate({
        id,
        replacementOpeningHours:
          filteredOpeningHours.length > 0
            ? { openingHoursRanges: newOpeningHours }
            : { openingHoursRanges: [] }
      });
    } else {
      await handleUpdate({
        id,
        replacementByAppointmentOpeningHours:
          filteredOpeningHours.length > 0
            ? { openingHoursRanges: newOpeningHours }
            : { openingHoursRanges: [] }
      });
    }
    editOpeningHours = false;
  }
</script>

{#if openingTimes}
  <dt>{text}</dt>
  <dd>
    {openingTimes}
    <button
      on:click={() => {
        editOpeningHours = !editOpeningHours;
      }}><EditIcon /></button
    >
  </dd>
{:else}
  {text}
  <button
    on:click={() => {
      editOpeningHours = !editOpeningHours;
    }}><EditIcon /></button
  >
{/if}
{#if editOpeningHours}
  {#each newOpeningHours as { startDay, endDay, openingTime, closingTime }, index}
    <DayInputField
      value={DAYS[startDay]}
      id={`${idStringBase}-start-${index}`}
      placeholder="First day in range"
      title="Opening Time"
      error={errors?.[`startDay${index}`] ?? null}
      on:update={(event) => {
        if (event.detail.trim() !== '') {
          const day = DAYS.findIndex(
            (element) => element.toLowerCase() === event.detail.toLowerCase()
          );
          if (day !== -1) {
            newOpeningHours[index].startDay = day;
          } else {
            newOpeningHours[index].startDay =
              index === 0 ? 0 : Math.min(6, newOpeningHours[index - 1].endDay + 1);
          }
        }
      }}
    />
    <DayInputField
      value={DAYS[endDay]}
      id={`${idStringBase}-end-${index}`}
      placeholder="Last day in range"
      title="Closing Time"
      error={errors?.[`endDay${index}`] ?? null}
      on:update={(event) => {
        const day = DAYS.findIndex(
          (element) => element.toLowerCase() === event.detail.toLowerCase()
        );
        if (day !== -1) {
          newOpeningHours[index].endDay = day;
        } else {
          newOpeningHours[index].endDay = 6;
        }
      }}
    />
    <TextInputField
      value={openingTime}
      id={`${idStringBase}-open-${index}`}
      placeholder="09:00"
      title="Opening Time"
      error={errors?.[`openingTime${index}`] ?? null}
      on:update={(event) => {
        const { detail } = event;
        if (/^([0-1]\d|2[0-3])$/.test(detail)) {
          newOpeningHours[index].openingTime = `${detail}:00`;
        } else if (/^\d$/.test(detail)) {
          newOpeningHours[index].openingTime = `0${detail}:00`;
        } else {
          newOpeningHours[index].openingTime = detail;
        }
      }}
    />
    <TextInputField
      value={closingTime}
      id={`${idStringBase}-close-${index}`}
      placeholder="18:00"
      title="Closing Time"
      error={errors?.[`closingTime${index}`] ?? null}
      on:update={(event) => {
        const { detail } = event;
        if (/^([0-1]\d|2[0-3])$/.test(detail)) {
          newOpeningHours[index].closingTime = `${detail}:00`;
        } else if (/^\d$/.test(detail)) {
          newOpeningHours[index].closingTime = `0${detail}:00`;
        } else {
          newOpeningHours[index].closingTime = detail;
        }
      }}
    />
    <button
      on:click|preventDefault={() => {
        handleFewerOpeningHours(index);
      }}><LessIcon /></button
    >
  {/each}
  <button on:click|preventDefault={handleMoreOpeningHours}
    ><span class="screen-reader-text">Add another set of by appointment opening hours</span
    ><MoreIcon /></button
  >
  <button on:click|preventDefault={handleUndoByAppointmentOpeningHoursChanges}
    ><UndoIcon /><span class="screen-reader-text">Forget about changes</span></button
  >
  <button on:click|preventDefault={handleUpdateOpeningHours}
    ><SaveIcon /><span class="screen-reader-text">Save changes</span></button
  >
{/if}
