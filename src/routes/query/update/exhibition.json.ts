import type { UpdateExhibitionInput, UpdateGalleryInput } from '$lib/generated/graphql';
import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request & { body: { input: UpdateExhibitionInput } }
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const { input } = request.body;
    const query = `
    mutation UpdateExhibition($updateExhibitionInput: UpdateExhibitionInput!) {
        updateExhibition(input: $updateExhibitionInput) {
          exhibition {
            id
            name
            description
            summaryText
            hashtags
            gallery {
              name
              slug
            }
            start
            end
            freeEntry
            online
            inPerson
          }
          errors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      updateExhibitionInput: input
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
    const error = `Error in /query/update/exhitibion.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
