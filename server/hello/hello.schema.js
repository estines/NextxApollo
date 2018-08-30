import {
	addMockFunctionsToSchema,
	gql,
	makeExecutableSchema
} from "apollo-server";

const helloSchema = makeExecutableSchema({
	typeDefs: gql`
		type Query {
			hello: String
		}
	`
});
addMockFunctionsToSchema({ schema: helloSchema });

export { helloSchema };
