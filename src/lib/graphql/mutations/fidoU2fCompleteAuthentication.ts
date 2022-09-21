const query = `
mutation FidoU2fCompleteAuthenticationMutation($fidoU2FCompleteAuthenticationSignData: FidoU2fSignResponseInput!) {
	fidoU2fCompleteAuthentication(signData: $fidoU2FCompleteAuthenticationSignData)
}
`;

export default query;
