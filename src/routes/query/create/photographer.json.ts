import type { RequestHandler } from './__types/photographer.json';

export const POST: RequestHandler = async function post({ request }) {
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
        Cookie: request.headers.get('Cookie')
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
};
