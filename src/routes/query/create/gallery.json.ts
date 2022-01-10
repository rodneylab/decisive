import type { CreateGalleryInput } from '$lib/generated/graphql';
import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request & { body: { input: CreateGalleryInput } }
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const { input } = request.body;
    const query = `
      mutation CreateGalleryMutation($createGalleryInput: CreateGalleryInput!) {
        createGallery(input: $createGalleryInput) {
          gallery {
            id
            name
            slug
            address
            openingTimes
            website
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      createGalleryInput: input
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.cookie
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const { headers } = response;
    const data = await response.json();

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/create/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
