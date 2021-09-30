export async function post(): Promise<
  { body: { greeting: string } } | { error: string; status: number }
> {
  try {
    const query = `
      query Query {
        hello
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
      body: {
        ...data
      }
    };
  } catch (err) {
    const error = `Error in /query/hello.json: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
