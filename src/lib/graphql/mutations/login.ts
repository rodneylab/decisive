const query = `
mutation LoginMutation($loginCredentials: LoginInput!) {
	login(credentials: $loginCredentials) {
		user {
			email
			username
			id
		}
		errors {
			message
			field
		}
	}
}
`;

export default query;
