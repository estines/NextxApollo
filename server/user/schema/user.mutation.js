import { gql } from "apollo-server";

const userMutation = gql`
	type Mutation {
		signup(email: String!, username: String!, password: String!): Auth
    signin(username: String!, password: String!): Auth
    signout: User
		token(username: String!, refreshToken: String!): Auth
	}
`;
export { userMutation };
