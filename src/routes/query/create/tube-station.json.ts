import type { Request } from '@sveltejs/kit';

export async function post(
  request: Request & { body: { name } }
): Promise<{ body: string } | { error: string; status: number }> {
  try {
    const { name } = request.body;
    const query = `
			mutation CreateTubeStationMutation($createTubeStationName: String!) {
				createTubeStation(name: $createTubeStationName) {
					errors {
						field
						message
					}
					tubeStation {
						name
					}
				}
			}
    `;

    const variables = {
      createTubeStationName: name
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
    const error = `Error in /query/create/tube-station.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
}
