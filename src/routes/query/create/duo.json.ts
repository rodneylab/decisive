import type { RequestEvent } from '@sveltejs/kit';

export async function get({
  request
}: RequestEvent): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const query = `
      mutation DuoEnrollMutation {
        duoEnroll {
          qrCode
          activationCode
          error
        }
      }
    `;

    const variables = {};

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie')
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
    const error = `Error in /query/create/duo.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
