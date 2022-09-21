import registerMutation from '$lib/graphql/mutations/register';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ cookies, request }) {
  try {
    const { registerInput } = await request.json();
    const response = await graphqlQuery(
      registerMutation,
      {
        registerInput
      },
      request
    );

    const data = await response.json();
    const { headers } = response;

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/create/user.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
