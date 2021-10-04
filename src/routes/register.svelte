<script context="module">
  export const load = async ({ fetch }) => {
    try {
      const response = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        props: { ...(await response.json()) }
      };
    } catch (error) {
      console.error(`Error in load function for /login: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { goto, prefetch } from '$app/navigation';
  import EmailInputField from '$lib/components/EmailInputField.svelte';
  import PasswordInputField from '$lib/components/PasswordInputField.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import TextInputField from '$lib/components/TextInputField.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { User } from '$lib/generated/graphql';
  import user from '$lib/shared/stores/user';
  import { mapErrorsToFields } from '$lib/utilities/form';

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
      const { errors: formErrors, user: userResponse } = responseData.data.register;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        user.set(userResponse);
        clearFormFields();
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in CreateGallery: ${error}`);
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
