import type { RequestEvent } from '@sveltejs/kit';

export async function post({
  request
}: RequestEvent & { body: { id: string } }): Promise<
  { body: string } | { error: string; status: number }
> {
  try {
    const { id } = await request.json();
    const query = `
      mutation DeleteGalleryMutation($deleteGalleryId: String!) {
        deleteGallery(id: $deleteGalleryId)
      }
    `;

    const variables = {
      deleteGalleryId: id
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
      body: JSON.stringify({ data })
    };
  } catch (err) {
    const error = `Error in /query/delete/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
