import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request & { body: { loginCredentials } }
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const { loginCredentials } = request.body;
    const query = `
      mutation LoginMutation($loginCredentials: LoginInput!) {
        login(credentials: $loginCredentials) {
          user {
            email
            username
            id
          }
          errors {
            message
            field
          }
        }
      }
    `;

    const variables = {
      loginCredentials
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const data = await response.json();
    const { headers } = response;

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/create/user.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
