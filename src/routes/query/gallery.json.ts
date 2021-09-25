export async function post(): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const query = `
      query Query {
        galleries {
          galleries {
            id
            name
            slug
            address
            openingTimes
            website
          }
          hasMore
        }
      }
    `;

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    });

    const data = await response.json();

    return {
      body: JSON.stringify({ ...data })
    };
  } catch (err) {
    const error = `Error in /query/gallery.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
