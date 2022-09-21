import type { RequestHandler } from './__types/exhibition.json';

export const POST: RequestHandler = async function post({ request }) {
	try {
		const query = `
    query Exhibitions {
        exhibitions {
          exhibitions {
            id
            name
            start
            end
            freeEntry
            online
            inPerson
            gallery {
              name
              slug
            }
            photographers {
              name
              slug
            }
            hashtags
          }
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

		return {
			body: JSON.stringify({ ...data }),
			headers: {
				'Set-Cookie': headers.get('Set-Cookie')
			}
		};
	} catch (err) {
		const error = `Error in /query/exhibition.json.ts: ${err}`;
		console.error(error);
		return {
			status: 500,
			error
		};
	}
};
