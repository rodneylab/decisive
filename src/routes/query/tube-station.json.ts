import type { RequestHandler } from './__types/tube-station.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const query = `
      query Query {
        tubeStations {
          id
          createdAt
          updatedAt
          name
          slug
        }
      }
    `;

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie')
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    });

    const data = await response.json();
    const { headers } = response;

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/tube-station.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
