<script lang="ts">
  import { browser } from '$app/env';
  import type { FidoU2FRequest } from '$lib/generated/graphql';
  import type { RegisterResponse } from 'u2f-api';
  import { isSupported, register } from 'u2f-api';
  const fidoU2fRegistered = false;
  const registerLoginButtonText = fidoU2fRegistered
    ? 'Log in with FIDO U2F'
    : 'Register with FIDO U2F';

  $: submitting = false;

  $: checkFidoU2FSupport;
  async function checkFidoU2FSupport() {
    return browser && (await isSupported());
  }

  $: fidoU2fSupported = checkFidoU2FSupport();

  async function completeRegistration(registerData: RegisterResponse) {
    try {
      const response = await fetch('/query/create/fido-u2f-register.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registerData
        })
      });
      const data = await response.json();
    } catch (error) {
      console.error(`Error in duoAuth function in /login/mfa: ${error}`);
    }
  }

  async function handleRegister() {
    if (browser && fidoU2fSupported) {
      try {
        const response = await fetch('/query/fido-u2f-register.json', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        const { fidoU2FBeginRegister }: { fidoU2FBeginRegister: FidoU2FRequest } = data.data;
        const registerData = await register([fidoU2FBeginRegister]);
        console.log('registerData: ', registerData);
        completeRegistration(registerData);
      } catch (error) {
        let message;
        if (error?.metaData?.type) {
          message = error.metaData.type;
        } else {
          message = error;
        }
        console.error(`Error in register function in /FidoU2F: ${message}`);
      }
    }
  }
</script>

{#if fidoU2fSupported}
  <button on:click={handleRegister} disabled={submitting}>{registerLoginButtonText}</button>
{:else}
  <div>FIDO U2F is not supported on your browser</div>
{/if}
