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
  import Duo from '$lib/components/Login/Duo.svelte';
  import FidoU2F from '$lib/components/Login/FidoU2F.svelte';
  import type { User } from '$lib/generated/graphql';
  export let me: User | null;

  const { duoRegistered } = me;
</script>

<Duo {duoRegistered} />
<FidoU2F />
