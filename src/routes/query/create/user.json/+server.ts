import registerMutation from '$lib/graphql/mutations/register';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ request, setHeaders }) {
  try {
    const { registerInput } = await request.json();
    const response = await graphqlQuery(
      registerMutation,
      {
        registerInput
      },
      request
    );

    // const { headers } = response;
    const data = await response.json();

    setHeaders({
      // 'Set-Cookie': headers.get('Set-Cookie'),
      'Content-Type': 'application/json'
    });

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/create/user.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
