import type { RequestHandler } from './__types/[id].json';

export const POST: RequestHandler = async function post({ params, request }) {
  try {
    const { id } = params;
    const query = `
    query Exhibitions($exhibitionId: String!) {
        exhibition(id: $exhibitionId) {
          exhibition {
            id
            name
            description
            url
            summaryText
            bodyText
            hashtags
            gallery {
              name
              slug
            }
            photographers {
              name
              slug
            }
            start
            end
            freeEntry
            online
            inPerson
          }
          error
        }
      }
    `;

    const variables = {
      exhibitionId: id
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie')
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
    const error = `Error in /query/exhibition/[id].json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
