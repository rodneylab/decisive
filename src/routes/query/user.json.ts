import type { RequestHandler } from './__types/user.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const { loginCredentials } = await request.json();
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
};
