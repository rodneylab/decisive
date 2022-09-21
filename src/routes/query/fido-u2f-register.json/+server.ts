import type { RequestHandler } from './$types';
import fidoU2fBeginRegisterQuery from '$lib/graphql/queries/fidoU2fBeginRegister';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async function get({ request }) {
  try {
    const response = await graphqlQuery(fidoU2fBeginRegisterQuery, {}, request);
    const data = await response.json();
    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/fido-u2f-register.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
