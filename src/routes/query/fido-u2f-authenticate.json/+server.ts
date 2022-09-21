import type { RequestHandler } from './$types';
import fidoU2fCompleteAuthenticationMutation from '$lib/graphql/mutations/fidoU2fCompleteAuthentication';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const { signData: fidoU2FCompleteAuthenticationSignData } = await request.json();
    const response = await graphqlQuery(
      fidoU2fCompleteAuthenticationMutation,
      { fidoU2FCompleteAuthenticationSignData },
      request
    );
    const data = await response.json();
    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/fido-u2f.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
