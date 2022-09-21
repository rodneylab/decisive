<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, prefetch } from '$app/navigation';
	import { PLACEHOLDER_TEXT, TITLE } from '$lib/constants/form';
	import type {
		FidoU2fAuthenticateRequest,
		FidoU2fRegisterRequest,
		FidoU2fRegistrationDataInput,
		FidoU2fSignRequest,
		Mutation
	} from '$lib/generated/graphql';
	import user from '$lib/shared/stores/user';
	import { TextInputField } from '@rodneylab/sveltekit-components';
	import { isSupported, register, sign } from 'u2f-api';

	export let fidoU2fRegistered: boolean = false;
	let label = '';
	$: registering = false;

	const registerLoginButtonText = fidoU2fRegistered
		? 'Log in with FIDO U2F'
		: 'Register with FIDO U2F';

	$: submitting = false;
	let registerData: FidoU2fRegistrationDataInput | null;
	$: registerData = null;

	$: checkFidoU2FSupport;
	async function checkFidoU2FSupport() {
		return browser && (await isSupported());
	}

	$: fidoU2fSupported = checkFidoU2FSupport();

	async function handleAuthenticateRegister() {
		if (fidoU2fRegistered) {
			await handleAuthenticate();
		} else {
			await handleRegister();
		}
	}

	async function authenticate(fidoU2fSignRequest: FidoU2fSignRequest) {
		try {
			const signData = await sign(fidoU2fSignRequest);

			const response = await fetch('/query/fido-u2f-authenticate.json', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					signData
				})
			});
			const data: { data: Mutation['fidoU2fCompleteAuthentication'] } = await response.json();
			const { data: authorised } = data;
			if (authorised) {
				user.set({ ...$user, mfaAuthenticated: true });
				await prefetch('/exhibition');
				await goto('/exhibition');
			} else {
				console.log('Access denied!');
				await prefetch('/login');
				await goto('/login');
			}
		} catch (error) {
			console.error(`Error in authenticate function in FidoU2f: ${error}`);
		}
	}

	async function handleAuthenticate() {
		try {
			const response = await fetch('/query/fido-u2f.json', {
				method: 'GET',
				credentials: 'include'
			});
			const data = await response.json();
			const { signRequests, labels }: FidoU2fAuthenticateRequest =
				data.data.fidoU2fBeginAuthenticate;
			console.log('Labels:', labels);
			// todo(rodneylab): allow user to select which key to use when there are multiple ones available
			authenticate(signRequests[0]);
		} catch (error) {
			console.error(`Error in duoHandleAuthenticate function in FidoU2f: ${error}`);
		}
	}

	async function completeRegistration() {
		try {
			const response = await fetch('/query/create/fido-u2f.json', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					input: { label, registerData }
				})
			});
			const data = await response.json();
			const { fidoU2fRegister: registrationSuccessful } = data.data;
			if (registrationSuccessful) {
				await prefetch('/gallery');
				await goto('/gallery');
			}
		} catch (error) {
			console.error(`Error in duoAuth function in /login/mfa: ${error}`);
		}
	}

	async function handleRegister() {
		if (browser && fidoU2fSupported) {
			try {
				registering = true;
				const response = await fetch('/query/fido-u2f-register.json', {
					method: 'GET',
					credentials: 'include'
				});
				const data = await response.json();
				const { fidoU2fBeginRegister }: { fidoU2fBeginRegister: FidoU2fRegisterRequest } =
					data.data;
				registerData = await register([fidoU2fBeginRegister]);
			} catch (error) {
				let message: string;
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
	{#if registering}
		<form on:submit|preventDefault={completeRegistration}>
			<TextInputField
				value={label}
				required
				placeholder={PLACEHOLDER_TEXT.fidoU2fLabel}
				id="fido-u2f-key-label"
				title={TITLE.fidoU2fLabel}
				on:update={(event) => {
					label = event.detail;
				}}
			/>
			<button type="submit" disabled={registerData == null && label === ''}
				>Complete registration</button
			>
		</form>
	{/if}
	<button on:click={handleAuthenticateRegister} disabled={submitting}
		>{registerLoginButtonText}</button
	>
{:else}
	<div>FIDO U2F is not supported on your browser</div>
{/if}
