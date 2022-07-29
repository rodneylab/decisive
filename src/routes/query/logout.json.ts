import type { RequestHandler } from './__types/logout.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const query = `
      mutation LogoutMutation {
        logout
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
    const error = `Error in /query/logout.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
