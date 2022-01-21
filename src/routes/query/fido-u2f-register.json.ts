import type { RequestEvent } from '@sveltejs/kit';

export async function get({
  request
}: RequestEvent): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const query = `
      query Query {
        fidoU2fBeginRegister {
          version
          appId
          challenge
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
    const error = `Error in /query/fido-u2f-register.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
