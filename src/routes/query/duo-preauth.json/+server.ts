import duoPreauthQuery from '$lib/graphql/queries/duoPreauth';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async function get({ cookies, request }) {
	try {
		const response = await graphqlQuery(duoPreauthQuery, {}, request);
		const data = await response.json();

		cookies.set('set-cookie', cookies.get('Set-Cookie'));

		return new Response(JSON.stringify({ ...data }));
	} catch (err: unknown) {
		const message = `Error in /query/duo-preauth.json.ts: ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
