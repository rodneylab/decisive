<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, prefetch } from '$app/navigation';
  import Duo from '$lib/components/Login/Duo.svelte';
  import FidoU2f from '$lib/components/Login/FidoU2f.svelte';
  import user from '$lib/shared/stores/user';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

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
