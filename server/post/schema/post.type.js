import { gql } from "apollo-server";

const postType = gql`
	type Post {
		_id: ID!
		author: String!
		comment: String!
	}
`;

export { postType };
