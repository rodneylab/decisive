const query = `
mutation RegisterMutation($registerInput: UsernameEmailPasswordInput!) {
	register(registerInput: $registerInput) {
		user {
			id
			email
			username
		}
		errors {
			field
			message
		}
	}
}
`;

export default query;
