import { gql } from "apollo-server";

const userType = gql`
	type User {
		_id: ID!
		email: String
		name: String
		picture: String
		role: String
		provider: String
		createdOn: String
		updatedOn: String
	}

	type Auth {
		_id: ID!
		email: String
		name: String
		picture: String
		role: String
		provider: String
		token: String
		rtoken: String
		createdOn: String
		updatedOn: String
	}
`;

export { userType };
