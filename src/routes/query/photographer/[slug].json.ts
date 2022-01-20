import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request & { params: { slug: string } }
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const { slug } = request.params;
    const query = `
      query PhotographerQuery($photographerQuerySlug: String!) {
        photographer(slug: $photographerQuerySlug) {
          photographer {
            name
            slug
            website
            websiteUrl
            exhibitions {
              id
              name
            }
            id
          }
        }
      }
    `;

    const variables = {
      photographerQuerySlug: slug
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

    console.log({ data });
    return {
      body: JSON.stringify({ ...data }),
      headers: {
        'Set-Cookie': headers.get('Set-Cookie')
      }
    };
  } catch (err) {
    const error = `Error in /query/photographer/[slug].json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
