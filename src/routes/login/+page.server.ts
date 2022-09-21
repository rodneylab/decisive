import meQuery from '$lib/graphql/queries/me';
import { graphqlQuery } from '$lib/utilities/graphql';
import type { Actions, PageServerLoad } from './$types';
import type { FieldError, User } from '$lib/generated/graphql';
import loginMutation from '$lib/graphql/mutations/login';
import { error, invalid, redirect } from '@sveltejs/kit';
import cookie from 'cookie';

export const load: PageServerLoad = async function load({ request }) {
	try {
		const response = await graphqlQuery(meQuery, {}, request);

		const data = (await response.json()) as { data: { me: User | null } };
		return { ...data };
	} catch (error) {
		console.error(`Error in load function for /login: ${error}`);
	}
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		try {
			const form = await request.formData();
			const username = form.get('username');
			const password = form.get('password');

			const response = await graphqlQuery(
				loginMutation,
				{
					loginCredentials: {
						username,
						password
					}
				},
				request
			);
			const {
				data: {
					login: { errors, user }
				}
			} = (await response.json()) as {
				data: { login: { errors: FieldError[]; user?: User } };
			};
			if (errors || !user) {
				return invalid(400, {});
			}

			const { headers } = response;
			const responseCookieValue = headers.get('set-cookie');
			if (responseCookieValue) {
				const { sessionId, Path, Expires, SameSite } = cookie.parse(responseCookieValue);
				cookies.set('sessionId', sessionId, {
					path: '/',
					expires: new Date(Expires),
					sameSite: SameSite as boolean | 'lax' | 'strict' | 'none'
				});
				throw redirect(303, '/login/mfa');
			}

			return { success: true };
		} catch (err: unknown) {
			const message = `Error in /login form: ${err as string}`;
			console.error(message);
			return error(500, message);
		}
	}
};
