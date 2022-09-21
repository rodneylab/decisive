import type { RequestHandler } from './__types/exhibition.json';

export const POST: RequestHandler = async function post({ request }) {
	try {
		const { input } = await request.json();
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
            photographers {
              name
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
				Cookie: request.headers.get('Cookie')
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
};
