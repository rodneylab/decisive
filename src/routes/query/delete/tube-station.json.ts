import type { RequestHandler } from './__types/gallery.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const { id } = await request.json();
    const query = `
      mutation DeleteGalleryMutation($deleteTubeStationId: String!) {
        deleteTubeStation(id: $deleteTubeStationId)
      }
    `;

    const variables = {
      deleteTubeStationId: id
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
    const error = `Error in /query/delete/tube-station.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
