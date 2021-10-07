<script lang="ts">
  import { goto, prefetch } from '$app/navigation';
  import type { DuoPreauthResponse } from '$lib/generated/graphql';
  import user from '$lib/shared/stores/user';

  $: enrolling = false;
  $: submitting = false;
  $: activationCode = null;
  $: qrCode = null;
  $: showQRCode = false;

  export let duoRegistered: boolean;
  const buttonText = duoRegistered ? 'Log in with Duo' : 'Register with Duo';

  async function authenticate(device: string) {
    try {
      const response = await fetch('/query/duo-auth.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device })
      });
      const data = await response.json();
      const { duoAuth: authorised } = data.data;
      if (authorised) {
        user.set({ ...$user, mfaAuthenticated: true });
        await prefetch('/gallery');
        await goto('/gallery');
      }
      console.log('Access denied!');
      await prefetch('/login');
      await goto('/login');
    } catch (error) {
      console.error(`Error in duoAuth function in /login/mfa: ${error}`);
    }
  }

  async function enroll() {
    enrolling = true;
    const response = await fetch('/query/create/duo.json', {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    const {
      activationCode: enrollActivationCode,
      error,
      qrCode: enrollQrCode
    } = data.data.duoEnroll;
    if (error) {
      console.error(`Error in duoPreauth enroll: ${error}`);
    } else {
      if (enrollQrCode) {
        qrCode = enrollQrCode;
      }
      if (enrollActivationCode) {
        activationCode = enrollActivationCode;
      }
    }
  }

  async function preauthenticate() {
    try {
      submitting = true;
      const response = await fetch('/query/duo-preauth.json', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      const { error, devices, result }: DuoPreauthResponse = data.data.duoPreauth;
      if (error) {
        console.error(`Error in duoPreauth: ${error}`);
      } else {
        if (result === 'enroll') {
          enroll();
        } else if (result === 'auth') {
          // todo(rodneylab): let user select a device when there are multiple ones available
          authenticate(devices[0].device);
        }
      }
    } catch (error) {
      console.error(`Error in handleDuo function in /login/mfa: ${error}`);
    }
  }

  async function verifyEnroll() {
    try {
      submitting = true;
      const response = await fetch('/query/duo-enroll.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activationCode
        })
      });
      const data = await response.json();
      const { error, result } = data.data.duoEnrollStatus;
      if (error) {
        console.error(`Error in verifyEnroll: ${error}`);
      } else {
        if (result === 'success') {
          enrolling = false;
        }
      }
    } catch (error) {
      console.error(`Error in verifyEnroll function in /login/mfa: ${error}`);
    }
  }
</script>

{#if enrolling}
  {#if showQRCode}
    <iframe title="Duo enroll QR code" src={qrCode} width="300" height="300" />
  {/if}
  <button
    on:click={() => {
      showQRCode = true;
    }}
    disabled={qrCode == null}>Show QR Code</button
  >
  <button on:click={verifyEnroll} disabled={activationCode == null}
    >I have successfully enrolled on my phone now.</button
  >
{/if}
<button on:click={preauthenticate} disabled={submitting}>{buttonText}</button>
