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
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import PasswordInputField from '$lib/components/PasswordInputField.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import TextInputField from '$lib/components/TextInputField.svelte';
  import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
  import type { User } from '$lib/generated/graphql';
  import user from '$lib/shared/stores/user';
  import { mapErrorsToFields } from '$lib/utilities/form';

  export let data: { me: User | null };
  const { me } = data;

  async function checkForLoggedInUser() {
    if (browser && me) {
      user.set({ ...me });
      await prefetch('/login/mfa');
      await goto('/login/mfa');
    }
  }

  checkForLoggedInUser();

  $: submitting = false;
  let errors: {
    username?: string;
    password?: string;
  };
  $: errors = {};

  function clearFormFields() {
    username = '';
    password = '';
  }

  async function handleSubmit() {
    try {
      submitting = true;
      const response = await fetch('/query/user.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loginCredentials: {
            username,
            password
          }
        })
      });
      const responseData = await response.json();
      const { errors: formErrors, user: userResponse } = responseData.data.login;
      submitting = false;
      if (formErrors) {
        errors = mapErrorsToFields(formErrors);
      } else {
        user.set({ ...userResponse });
        clearFormFields();
        await prefetch('/login/mfa');
        await goto('/login/mfa');
      }
    } catch (error) {
      console.error(`Error in handleSubmit function in /login: ${error}`);
    }
  }

  let password = '';
  let username = '';
  const title = 'Login';
  const metadescription = 'Log in to view your messages.  Alternatively set up a new account.';
  const slug = 'login';
</script>

<SEO {title} {metadescription} {slug} />
<h1>Login</h1>
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
  <PasswordInputField
    value={password}
    id="login-password"
    error={errors?.password ?? null}
    on:update={(event) => {
      password = event.detail;
    }}
  />
  <button type="submit" disabled={submitting}>Login</button>
</form>
