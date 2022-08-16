import type { RequestHandler } from './__types/fido-u2f.json';

export const GET: RequestHandler = async function get({ request }) {
  try {
    const query = `
      query Query {
        fidoU2fBeginAuthenticate {
          labels
          signRequests {
            keyHandle
            challenge
            appId
            version
          }
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
    const error = `Error in /query/fido-u2f.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
