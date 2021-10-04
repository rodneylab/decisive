<script lang="ts">
  import user from '$lib/shared/stores/user';

  $: isGuest = !$user;

  async function handleLogout() {
    try {
      const response = await fetch('/query/logout.json', {
        method: 'POST',
        credentials: 'include'
      });
      const responseData = await response.json();
      const { logout } = responseData.data;
      console.log('Logged out? : ', logout);
      user.set(null);
    } catch (error) {
      console.error(`Error in handleLogout function in Header: ${error}`);
    }
  }
</script>

<header>
  <div>Decisive</div>
  {#if isGuest}
    <a sveltekit:prefetch rel="external" aria-label="Log in" href="/login">Login</a>
    <a aria-label="Register" href="/register">Register</a>
  {:else}
    <a aria-label="Open Galleries" href="/gallery">Galleries</a>
    <div>{$user.username}</div>
    <button type="button" on:click={handleLogout}>Logout</button>
  {/if}
</header>
