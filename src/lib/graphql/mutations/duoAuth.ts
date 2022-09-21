const query = `
mutation DuoAuthMutation($duoAuthDevice: String!) {
	duoAuth(device: $duoAuthDevice)
}
`;

export default query;
