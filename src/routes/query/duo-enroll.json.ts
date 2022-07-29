import type { RequestHandler } from './__types/duo-enroll.json';

export const POST: RequestHandler = async function post({ request }) {
  try {
    const { activationCode } = await request.json();

    const query = `
		query Query($duoEnrollStatusActivationCode: String!) {
			duoEnrollStatus(activationCode: $duoEnrollStatusActivationCode) {
				result
				error
			}
		}
		
    `;

    const variables = {
      duoEnrollStatusActivationCode: activationCode
    };

    const response = await fetch(process.env['GRAPHQL_ENDPOINT'], {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('Cookie')
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
    const error = `Error in /query/duo-preauth.json.ts: ${err}`;
    console.error(error);
    return {
      status: 500,
      error
    };
  }
};
