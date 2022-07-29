import type { RequestHandler } from './__types/duo-auth.json';

export const POST: RequestHandler = async function post({ request }) {
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
};
