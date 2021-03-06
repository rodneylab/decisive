import type { FidoU2fRegisterInput } from '$lib/generated/graphql';
import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export async function post({
  request
}: RequestEvent & { body: { input: FidoU2fRegisterInput } }): Promise<EndpointOutput> {
  // { body: string } | { error: string; status: number }
  // > {
  try {
    const { input } = await request.json();
    const query = `
      mutation FidoU2fRegisterMutation(
        $fidoU2FRegisterRegisterInput: FidoU2fRegisterInput!
      ) {
        fidoU2fRegister(registerInput: $fidoU2FRegisterRegisterInput)
      }
    `;

    const variables = {
      fidoU2FRegisterRegisterInput: input
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
    const error = `Error in /query/create/fido-u2f.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
