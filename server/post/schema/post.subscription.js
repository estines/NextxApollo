import { gql } from "apollo-server";

const postSubscription = gql`
	type Subscription {
		posts: Post
	}
`;

export { postSubscription };
