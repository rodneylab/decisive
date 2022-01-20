<script lang="ts">
  import { browser } from '$app/env';
  import type { CreatePhotographerInput } from '$lib/generated/graphql';
  import { mapErrorsToFields, PhotographerFormErrors } from '$lib/utilities/form';
  import { TextInputField } from '@rodneylab/sveltekit-components';
  import slugify from 'slugify';
  import { beforeNavigate } from '$app/navigation';
  import photographers from '$lib/shared/stores/photographers';

  $: submitting = false;
  let firstName = browser
    ? window.sessionStorage.getItem('create-photographer-first-name') ?? ''
    : '';
  let otherNames = browser
    ? window.sessionStorage.getItem('create-photographer-other-names') ?? ''
    : '';
  let lastName = browser
    ? window.sessionStorage.getItem('create-photographer-last-name') ?? ''
    : '';

  let slug = browser ? window.sessionStorage.getItem('create-photographer-slug') ?? '' : '';
  let website = browser ? window.sessionStorage.getItem('create-photographer-website') ?? '' : '';

  let errors: PhotographerFormErrors = {};

  beforeNavigate(() => {
    ['first-name', 'other-names', 'last-name', 'slug', 'website'].forEach((element) =>
      sessionStorage.removeItem(`create-photographer-${element}`)
    );
  });

  function clearFormFields() {
    ['first-name', 'other-names', 'last-name', 'slug', 'website'].forEach((element) =>
      sessionStorage.removeItem(`create-photographer-${element}`)
    );
    firstName = '';
    otherNames = '';
    lastName = '';
    slug = '';
    website = '';
  }

  function sessionStore(field: string, value: string) {
    browser && window.sessionStorage.setItem(`create-photographer-${field}`, value);
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const data: CreatePhotographerInput = {
        firstName,
        otherNames,
        lastName,
        slug,
        website
      };
      const response = await fetch('/query/create/photographer.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });
      const responseData = await response.json();
      console.log('responseData: ', { responseData });
      const { errors: formErrors, photographer } = responseData.data.createPhotographer;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        photographers.set([...$photographers, photographer]);
        clearFormFields();
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in CreatePhotographer: ${error}`);
    }
  }
</script>

<h1>Create Photographer</h1>
<aside id="create-photographer">
  <form on:submit|preventDefault={handleSubmit}>
    <TextInputField
      value={firstName}
      id="create-photographer-first-name"
      placeholder="Photographer first name"
      title="First name"
      error={errors?.firstName ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('first-name', detail);
        firstName = detail;
      }}
    />
    <TextInputField
      value={otherNames}
      id="create-photographer-other-names"
      placeholder="Photographer other names"
      title="Other names"
      error={errors?.otherNames ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('other-names', detail);
        otherNames = detail;
      }}
    />
    <TextInputField
      value={lastName}
      id="create-photographer-last-name"
      placeholder="Photographer last name"
      title="Last name"
      error={errors?.lastName ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('last-name', detail);
        lastName = detail;
        if (slug === '') {
          slug = slugify(
            [
              ...(firstName ? [firstName.trim()] : []),
              ...(otherNames ? [otherNames.trim()] : []),
              ...(detail ? [detail.trim()] : [])
            ].join(' '),
            { remove: /[\.']/g, lower: true }
          );
        }
      }}
    />
    <TextInputField
      value={slug}
      id="create-photographer-slug"
      placeholder="Photographer slug"
      title="Slug"
      error={errors?.slug ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('slug', detail);
        slug = detail;
      }}
    />
    <TextInputField
      value={website}
      id="create-photographer-website"
      placeholder="Photographer website"
      title="Website"
      error={errors?.website ?? null}
      on:update={(event) => {
        const { detail } = event;
        sessionStore('website', detail);
        website = detail;
      }}
    />
    <button type="submit" disabled={submitting}>Create new photographer</button>
  </form>
</aside>
