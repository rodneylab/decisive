<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit';

  export const load = async ({ fetch, url }: LoadInput) => {
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
      const { pathname } = url;
      console.error(`Error in load function for ${pathname}: ${error}`);
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
      await prefetch('/exhibition');
      await goto('/exhibition');
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
