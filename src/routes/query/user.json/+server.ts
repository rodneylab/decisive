import type { RequestHandler } from './$types';
import loginMutation from '$lib/graphql/mutations/login';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async function post({ request, setHeaders }) {
  try {
    const { loginCredentials } = await request.json();
    const response = await graphqlQuery(loginMutation, { loginCredentials }, request);
    const data = await response.json();
    const { headers } = response;
    setHeaders({
      'Set-Cookie': headers.get('Set-Cookie'),
      'Content-Type': 'application/json'
    });

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/fido-u2f.json.ts: ${err as string}`;
    console.error(message);
    return error(500, message);
  }
};
