import { addMockFunctionsToSchema, makeExecutableSchema } from "apollo-server";
import { postType, postQuery, postMutation, postSubscription } from "./schema";

const postSchema = makeExecutableSchema({
	typeDefs: [postType, postQuery, postMutation, postSubscription]
});
addMockFunctionsToSchema({ schema: postSchema });

export { postSchema };
