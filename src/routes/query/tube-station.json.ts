import type { RequestEvent } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post({
  request
}: RequestEvent): Promise<
  { body: string; headers: ResponseHeaders } | { error: string; status: number }
> {
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
}
