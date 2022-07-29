<script context="module" lang="ts">
  import type { Load } from './__types/register';

  export const load: Load = async function load({ fetch, url }) {
    try {
      const response = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include'
      });
      return {
        props: { ...(await response.json()) }
      };
    } catch (error) {
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { goto, prefetch } from '$app/navigation';
  import SEO from '$lib/components/SEO/index.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { Mutation, User } from '$lib/generated/graphql';
  import user from '$lib/shared/stores/user';
  import { mapErrorsToFields } from '$lib/utilities/form';
  import {
    EmailInputField,
    PasswordInputField,
    TextInputField
  } from '@rodneylab/sveltekit-components';

  export let data: { me: User } | undefined;
  const { me } = data;

  if (me) {
    user.set({ ...me });
  }

  async function checkForLoggedInUser() {
    if ($user) {
      await prefetch('/gallery');
      goto('/gallery');
    }
  }

  checkForLoggedInUser();

  $: submitting = false;
  let errors: {
    username?: string;
    password?: string;
    email?: string;
  };
  $: errors = {};

  let email = '';
  let password = '';
  let username = '';

  function clearFormFields() {
    username = '';
    email = '';
    password = '';
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const response = await fetch('/query/create/user.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registerInput: {
            username,
            email,
            password
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, user: userResponse }: Mutation['register'] =
        responseData.data.register;
      submitting = false;
      if (formErrors?.length) {
        errors = mapErrorsToFields(formErrors);
      } else {
        user.set(userResponse);
        clearFormFields();
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in register: ${error}`);
    }
  }

  const title = 'Register';
  const metadescription = 'Register in to view your messages.  Alternatively set up a new account.';
  const slug = 'register';
</script>

<SEO {title} {metadescription} {slug} />
<h1>Register</h1>
<form on:submit|preventDefault={handleSubmit}>
  <TextInputField
    value={username}
    id="login-username"
    placeholder={PLACEHOLDER_TEXT.username}
    title={TITLE.username}
    error={errors?.username ?? null}
    on:update={(event) => {
      username = event.detail;
    }}
  />
  <EmailInputField
    value={email}
    id="login-email"
    error={errors?.email ?? null}
    on:update={(event) => {
      email = event.detail;
    }}
  />
  <PasswordInputField
    value={password}
    id="login-password"
    error={errors?.password ?? null}
    on:update={(event) => {
      password = event.detail;
    }}
  />
  <button type="submit" disabled={submitting}>Register</button>
</form>
