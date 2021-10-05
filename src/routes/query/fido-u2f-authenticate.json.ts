import type { FidoU2fSignResponseInput } from '$lib/generated/graphql';
import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { body: { signData: FidoU2fSignResponseInput } }
): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const { signData } = request.body;
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
        Cookie: request.headers.cookie
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
}
