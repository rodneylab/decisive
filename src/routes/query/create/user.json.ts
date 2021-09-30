import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { body: { registerInput } }
): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const { registerInput } = request.body;
    const query = `
			mutation RegisterMutation($registerInput: UsernameEmailPasswordInput!) {
				register(options: $registerInput) {
					user {
						email
						id
						username
					}
          errors {
            field
            message
          }
				}
			}
    `;

    const variables = {
      registerInput
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
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
    const error = `Error in /query/create/user.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
