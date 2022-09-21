import { GRAPHQL_ENDPOINT } from '$env/static/private';

export async function graphqlQuery(
	query: string,
	variables: Record<string, any>,
	request: Request
) {
	return fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Cookie: request.headers.get('cookie')
		},
		body: JSON.stringify({
			query,
			variables
		})
	});
}
