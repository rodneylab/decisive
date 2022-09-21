const query = `
mutation FidoU2fRegisterMutation(
	$fidoU2FRegisterRegisterInput: FidoU2fRegisterInput!
) {
	fidoU2fRegister(registerInput: $fidoU2FRegisterRegisterInput)
}
`;

export default query;
