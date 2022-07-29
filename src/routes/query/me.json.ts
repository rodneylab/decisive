import type { RequestHandler } from './__types/me.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const query = `
      query MeQuery {
        me {
          id
          username
          email
          duoRegistered
          fidoU2fRegistered
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
    const { headers } = response;
    const data = await response.json();

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/me.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
