import type { RequestHandler } from './__types/photographer.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const query = `
    query Photographers {
      photographers {
        photographers {
          name
          slug
          website
          websiteUrl
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
        Cookie: request.headers.get('cookie')
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    });

    const { headers } = response;
    const data = await response.json();
    // console.log(`photographers.json:`, { ...data.photographers });

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
};
