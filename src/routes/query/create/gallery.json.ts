import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { body: { input } }
): Promise<{ body: string } | { error: string; status: number }> {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const data = await response.json();

    return {
      body: JSON.stringify({ ...data })
    };
  } catch (err) {
    const error = `Error in /query/update/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
