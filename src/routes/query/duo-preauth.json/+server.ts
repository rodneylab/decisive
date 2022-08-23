import duoPreauthQuery from '$lib/graphql/queries/duoPreauth';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async function get({ request, setHeaders }) {
  try {
    const response = await graphqlQuery(duoPreauthQuery, {}, request);
    // const { headers } = response;
    const data = await response.json();

    setHeaders({
      // 'Set-Cookie': headers.get('Set-Cookie'),
      'Content-Type': 'application/json'
    });

    return new Response(JSON.stringify({ ...data }));
  } catch (err: unknown) {
    const message = `Error in /query/duo-preauth.json.ts: ${err as string}`;
    console.error(message);
    throw error(500, message);
  }
};
