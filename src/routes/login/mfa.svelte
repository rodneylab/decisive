<script context="module">
  export const load = async ({ fetch }) => {
    try {
      // check for valid user session
      const meResponse = await fetch('/query/me.json', {
        method: 'POST',
        credentials: 'include'
      });
      return {
        props: { ...(await meResponse.json()) }
      };
    } catch (error) {
      console.error(`Error in load function for /login/mfa: ${error}`);
    }
  };
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';
  import Duo from '$lib/components/Login/Duo.svelte';
  import FidoU2f from '$lib/components/Login/FidoU2f.svelte';
  import type { User } from '$lib/generated/graphql';
  import user from '$lib/shared/stores/user';
  import { onMount } from 'svelte';
  export let data: { me: User | null };

  const { me } = data;

  async function checkForLoggedInUser() {
    if ($user?.mfaAuthenticated) {
      await prefetch('/gallery');
      await goto('/gallery');
    } else if (browser) {
      if (me) {
        user.set({ ...me });
      } else {
        await prefetch('/login');
        await goto('/login');
      }
    }
  }

  onMount(() => {
    checkForLoggedInUser();
  });

  const { duoRegistered, fidoU2fRegistered } = me;
</script>

<Duo {duoRegistered} />
<FidoU2f {fidoU2fRegistered} />
