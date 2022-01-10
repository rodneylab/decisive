<script lang="ts">
  import { browser } from '$app/env';
  import type { CreateExhibitionInput } from '$lib/generated/graphql';
  import { ExhibitionFormErrors, mapErrorsToFields } from '$lib/utilities/form';
  import { TextArea, TextInputField } from '@rodneylab/sveltekit-components';
  import { Datepicker } from 'svelte-calendar';

  export let gallerySlug: string;

  $: submitting = false;
  let name = browser
    ? window.sessionStorage.getItem(`${gallerySlug}-create-exhibition-name}`) ?? ''
    : '';
  let description = browser
    ? window.sessionStorage.getItem(`${gallerySlug}-create-exhibition-description}`) ?? ''
    : '';
  let summaryText = browser
    ? window.sessionStorage.getItem(`${gallerySlug}-create-exhibition-summaryText}`) ?? ''
    : '';
  let hashtags = [];
  let freeEntry: boolean;
  let online: boolean;
  let inPerson: boolean;

  let errors: ExhibitionFormErrors = {};

  let start: Date;
  let end: Date;
  $: start = new Date();
  $: end = new Date();
  $: freeEntry = false;
  $: online = false;
  $: inPerson = true;
  const dateFormat = 'dddd, DD-MMM-YYYY';

  function clearFormFields() {
    ['name', 'description', 'summaryText'].forEach((element) =>
      sessionStorage.removeItem(`${gallerySlug}-create-exhibition-${element}}`)
    );
    name = '';
    description = '';
    summaryText = '';
    hashtags = [];
    freeEntry = false;
    online = false;
    inPerson = true;
  }

  function sessionStore(field: string, value: string) {
    browser && window.sessionStorage.setItem(`${gallerySlug}-create-exhibition-${field}}`, value);
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const data: CreateExhibitionInput = {
        name,
        description,
        summaryText,
        hashtags,
        gallery: gallerySlug,
        start: start.toUTCString(),
        end: end.toUTCString(),
        freeEntry,
        online,
        inPerson
      };
      const response = await fetch('/query/create/exhibition.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });
      const responseData = await response.json();
      console.log('responseData: ', { responseData });
      const { errors: formErrors } = responseData.data.createExhibition;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        clearFormFields();
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in CreateGallery: ${error}`);
    }
  }
</script>

<h1>Create Exhibition</h1>
<aside id="create-gallery">
  <form on:submit|preventDefault={handleSubmit}>
    <TextInputField
      value={name}
      id="create-exhibition-name"
      placeholder="Exhibition name"
      title="Name"
      error={errors?.name ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('name', detail);
        name = detail;
      }}
    />
    <TextArea
      value={description}
      id="create-exhibition-description"
      rows={2}
      placeholder="Exhibition description"
      title="Exhibition description"
      error={errors?.description ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('description', detail);
        description = detail;
      }}
    />
    <TextArea
      value={summaryText}
      id="create-exhibition-summary"
      rows={4}
      placeholder="Exhibition summary"
      title="Exhibition summary"
      error={errors?.summaryText ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('summaryText', detail);
        summaryText = detail;
      }}
    />
    <TextInputField
      value={hashtags.join(' ')}
      id="create-exhibition-hashtags"
      placeholder="Exhibition hashtags"
      title="Hashtags"
      error={errors?.hashtags ?? null}
      on:update={(event) => {
        const { detail } = event;
        hashtags = detail.split(',').map((element) => element.trim());
      }}
    />
    <Datepicker bind:selected={start} format={dateFormat} />
    <Datepicker bind:selected={end} format={dateFormat} />
    <label for="create-exhibition-free-entry">Free entry?</label>
    <input
      id="create-exhibition-free-entry"
      type="checkbox"
      name="Free entry"
      bind:checked={freeEntry}
    />
    <label for="create-exhibition-online">Online?</label>
    <input
      id="create-exhibition-online"
      type="checkbox"
      name="Online exhibition"
      bind:checked={online}
    />
    <label for="create-exhibition-in-person">In person?</label>

    <input
      id="create-exhibition-in-person"
      type="checkbox"
      name="In Person exhibition"
      bind:checked={inPerson}
    />
    <button type="submit" disabled={submitting}>Create new exhibition</button>
  </form>
</aside>
