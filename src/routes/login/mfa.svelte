<script context="module">
  export const load = async ({ fetch }) => {
    try {
      // check for valid user session
      const meResponse = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { data } = await meResponse.json();
      if (!data?.me) {
        return {
          status: 301,
          redirect: '/login'
        };
      }
      return {
        props: { ...data }
      };
    } catch (error) {
      console.error(`Error in load function for /login/mfa: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { goto, prefetch } from '$app/navigation';
  import type { DuoPreauthResponse, User } from '$lib/generated/graphql';

  $: duoEnrolling = false;
  $: submitting = false;
  $: activationCode = null;
  $: qrCode = null;
  $: showQRCode = false;
  export let me: User | null;

  const duoButtonText = me.duoRegistered ? 'Log in with Duo' : 'Register with Duo';

  async function duoAuth(device: string) {
    try {
      duoEnrolling = true;
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
        console.log('Access is not denied on this ocassion');
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

  async function duoEnroll() {
    duoEnrolling = true;
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

  async function duoPreauth() {
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
          duoEnroll();
        } else if (result === 'auth') {
          // todo(rodneylab): let user select a device when there are multiple ones available
          duoAuth(devices[0].device);
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
          duoEnrolling = false;
        }
      }
    } catch (error) {
      console.error(`Error in verifyEnroll function in /login/mfa: ${error}`);
    }
  }
</script>

{#if duoEnrolling}
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
<button on:click={duoPreauth} disabled={submitting}>{duoButtonText}</button>
