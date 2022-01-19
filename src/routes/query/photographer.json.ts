import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const query = `
    query Photographers {
      photographers {
        photographers {
          name
          slug
          website
          websiteUrl
          exhibitions {
            name
          }
          id
        }
        hasMore
      }
    }
    `;

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.cookie
      },
      body: JSON.stringify({
        query,
        variables: {}
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
    const error = `Error in /query/photographer.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
