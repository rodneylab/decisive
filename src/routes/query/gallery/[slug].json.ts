import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { params: { slug } }
): Promise<{ body: string } | { error: string; status: number }> {
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
            openingTimes
            website
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
    const error = `Error in /query/gallery/[slug].json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
