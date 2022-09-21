<script lang="ts">
	import { goto, prefetch } from '$app/navigation';
	import user from '$lib/shared/stores/user';
	import HeaderNavLink from '$lib/components/Layout/HeaderNavLink.svelte';

	export let pathname: string;

	$: isGuest = !!!$user;

	async function handleLogout() {
		try {
			const response = await fetch('/query/logout.json', {
				method: 'POST',
				credentials: 'include'
			});
			const responseData = await response.json();
			const { logout } = responseData.data;
			if (logout) {
				user.set(null);
				await prefetch('/');
				await goto('/');
			}
		} catch (error) {
			console.error(`Error in handleLogout function in Header: ${error}`);
		}
	}
</script>

<header>
	<div>Decisive</div>
	{#if isGuest}
		<a data-sveltekit-prefetch rel="external" aria-label="Log in" href="/login">Login</a>
		<a aria-label="Register" href="/register">Register</a>
	{:else}
		<HeaderNavLink label="Open Exhibitions" href="/exhibition" text="Exhibitions" {pathname} />
		<HeaderNavLink label="Open Galleries" href="/gallery" text="Galleries" {pathname} />
		<HeaderNavLink
			label="Open Photographers"
			href="/photographer"
			text="Photographers"
			{pathname}
		/>
		<HeaderNavLink
			label="Open Tube Stations"
			href="/tube-station"
			text="Tube Stations"
			{pathname}
		/>
		<div>{$user.username}</div>
		<button type="button" on:click={handleLogout}>Logout</button>
	{/if}
</header>
