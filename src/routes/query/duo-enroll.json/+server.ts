import duoEnrollStatusQuery from '$lib/graphql/queries/duoEnrollStatus';
import { graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function post({ request, setHeaders }) {
  try {
    const { activationCode: duoEnrollStatusActivationCode } = await request.json();
    const response = await graphqlQuery(
      duoEnrollStatusQuery,
      {
        duoEnrollStatusActivationCode
      },
      request
    );
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
