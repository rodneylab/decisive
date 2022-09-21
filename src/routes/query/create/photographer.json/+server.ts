import type { CreatePhotographerResponse } from '$lib/generated/graphql';
import createPhotographerMutation from '$lib/graphql/mutations/createPhotographer';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ cookies, request }) {
  try {
    const { data: createPhotographerInput } = await request.json();
    const response = await graphqlQuery(
      createPhotographerMutation,
      {
        createPhotographerInput
      },
      request
    );
    const data = (await response.json()) as CreatePhotographerResponse;

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/create/photographer.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
