import logoutMutation from '$lib/graphql/mutations/logout';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const response = await graphqlQuery(logoutMutation, {}, request);
    const data = await response.json();
    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/logout.json.ts: ${err as string}`;
    console.error(message);
    return error(500, message);
  }
};
