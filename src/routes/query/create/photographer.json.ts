import type { CreatePhotographerInput } from '$lib/generated/graphql';
import type { RequestEvent } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post({
  request
}: RequestEvent & { body: { data: CreatePhotographerInput } }): Promise<
  { body: string; headers: ResponseHeaders } | { error: string; status: number }
> {
  try {
    const { data: input } = await request.json();
    const query = `
    mutation CreatePhotographer($createPhotographerInput: CreatePhotographerInput!) {
        createPhotographer(input: $createPhotographerInput) {
          errors {
            field
            message
          }
          photographer {
            id
            name
            slug
            website
            websiteUrl
          }
        }
      }
      
    `;

    const variables = {
      createPhotographerInput: input
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.cookie
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const { headers } = response;
    const data = await response.json();

    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/create/photographer.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
