import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { GRAPHQL_ENDPOINT } from '$env/static/private';

// todo(rodneylab): deprecate this endpoint

export const POST: RequestHandler = async function post({ request, setHeaders, url }) {
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
    const response = await fetch(GRAPHQL_ENDPOINT, {
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

    setHeaders({
      'Set-Cookie': headers.get('Set-Cookie'),
      'Content-Type': 'application/json'
    });

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/me.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
