import type { RequestHandler } from './__types/fido-u2f-authenticate.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const { signData } = await request.json();
    const query = `
      mutation FidoU2fCompleteAuthenticationMutation($fidoU2FCompleteAuthenticationSignData: FidoU2fSignResponseInput!) {
        fidoU2fCompleteAuthentication(signData: $fidoU2FCompleteAuthenticationSignData)
      }
    `;

    const variables = {
      fidoU2FCompleteAuthenticationSignData: signData
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
    const error = `Error in /query/fido-u2f.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
