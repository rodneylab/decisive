import fidoU2fRegsterMutation from '$lib/graphql/mutations/fidoU2fRegister';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ request }) {
	try {
		const { input: fidoU2FRegisterRegisterInput } = await request.json();
		const response = await graphqlQuery(
			fidoU2fRegsterMutation,
			{ fidoU2FRegisterRegisterInput },
			request
		);
		const data = await response.json();
		return new Response(JSON.stringify({ ...data }));
	} catch (err: unknown) {
		const message = `Error in /query/create/fido-u2f.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
