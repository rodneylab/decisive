import type { RequestHandler } from './__types/gallery.json';

export const POST = async function post({ request }) {
  try {
    const { input } = await request.json();
    const query = `
      mutation UpdateGalleryMutation($updateGalleryInput: UpdateGalleryInput!) {
        updateGallery(input: $updateGalleryInput) {
          gallery {
            id
            name
            slug
            address
            openingTimes
            openingTimes
            byAppointmentOpeningTimes
            website
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
        'Content-Type': 'application/json',
        Cookie: request.headers.get('Cookie')
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
    const error = `Error in /query/update/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
