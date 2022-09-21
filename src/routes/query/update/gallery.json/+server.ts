import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import updateGalleryMutation from '$lib/graphql/mutations/updateGallery';
import { graphqlQuery } from '$lib/utilities/graphql';

export const POST: RequestHandler = async function post({ cookies, request }) {
  try {
    const { input: updateGalleryInput } = await request.json();
    const response = await graphqlQuery(
      updateGalleryMutation,
      {
        updateGalleryInput
      },
      request
    );

    const { headers } = response;
    const data = await response.json();

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/update/gallery.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
