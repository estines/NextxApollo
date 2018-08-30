import {
	addMockFunctionsToSchema,
	gql,
	makeExecutableSchema
} from "apollo-server";
import { userType, userQuery, userMutation } from "./schema";

const userSchema = makeExecutableSchema({
	typeDefs: [userType, userQuery, userMutation]
});
addMockFunctionsToSchema({ schema: userSchema });

export { userSchema };
