import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { body: { input } }
): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const { input } = request.body;
    const query = `
			mutation UpdateGalleryMutation($updateGalleryInput: UpdateGalleryInput!) {
				updateGallery(input: $updateGalleryInput) {
					gallery {
						id
						name
						slug
						address
						openingTimes
						website
            location
						openStreetMap
					}
					errors {
						field
						message
					}
				}
			}
    `;

    const variables = {
      updateGalleryInput: input
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
    const error = `Error in /query/create/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
