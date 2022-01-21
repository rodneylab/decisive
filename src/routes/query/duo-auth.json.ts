import type { RequestEvent } from '@sveltejs/kit';

export async function post({
  request
}: RequestEvent & { body: { device: string } }): Promise<
  { body: string } | { error: string; status: number }
> {
  try {
    const { device } = await request.json();
    const query = `
      mutation DuoAuthMutation($duoAuthDevice: String!) {
        duoAuth(device: $duoAuthDevice)
      }
    `;

    const variables = {
      duoAuthDevice: device
    };

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
    const error = `Error in /query/duo-auth.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
