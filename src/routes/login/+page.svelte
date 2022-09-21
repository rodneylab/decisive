<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, prefetch } from '$app/navigation';
	import SEO from '$lib/components/SEO/index.svelte';
	import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
	import user from '$lib/shared/stores/user';
	import type { PageData } from './$types';

	export let data: PageData;

	const {
		data: { me }
	} = data;

	async function checkForLoggedInUser() {
		if (browser && me) {
			user.set({ ...me });
			await prefetch('/login/mfa');
			await goto('/login/mfa');
		}
	}

	checkForLoggedInUser();

	const title = 'Login';
	const metadescription = 'Log in to view your messages.  Alternatively set up a new account.';
	const slug = 'login';
</script>

<SEO {title} {metadescription} {slug} />
<main>
	<h1>Login</h1>
	<form method="POST">
		<input
			name="username"
			type="text"
			placeholder={PLACEHOLDER_TEXT.username}
			title={TITLE.username}
		/>
		<input name="password" type="password" />
		<button type="submit">Login</button>
	</form>
</main>
