import type { Request } from '@sveltejs/kit';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export async function post(
  request: Request & { params: { slug } }
): Promise<{ body: string; headers: ResponseHeaders } | { error: string; status: number }> {
  try {
    const { slug } = request.params;
    const query = `
      query GalleryQuery($galleryQuerySlug: String!) {
        gallery(slug: $galleryQuerySlug) {
          gallery {
            id
            name
            slug
            address
            postalAddress {
              locality
            }
            openingTimes
            website
            websiteUrl
            openStreetMap
            location {
              latitude
              longitude
            }
          }
        }
      }
    `;

    const variables = {
      galleryQuerySlug: slug
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
    const error = `Error in /query/gallery/[slug].json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
