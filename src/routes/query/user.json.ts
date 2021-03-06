import type { LoginInput } from '$lib/generated/graphql';
import type { RequestEvent } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post({
  request
}: RequestEvent & { body: { loginCredentials: LoginInput } }): Promise<
  { body: string; headers: ResponseHeaders } | { error: string; status: number }
> {
  try {
    const { loginCredentials }: { loginCredentials: LoginInput } = await request.json();
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
