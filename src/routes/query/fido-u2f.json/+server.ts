import type { RequestHandler } from './$types';
import fidoU2fBeginAuthenticateQuery from '$lib/graphql/queries/fidoU2fBeginAuthenticate';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async function get({ request }) {
  try {
    const response = await graphqlQuery(fidoU2fBeginAuthenticateQuery, {}, request);
    const data = await response.json();
    return new Response(JSON.stringify({ ...data }));
  } catch (err) {
    const message = `Error in /query/fido-u2f.json.ts: ${err}`;
    console.error(message);
    return error(500, message);
  }
};
