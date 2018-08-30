import { helloResolver } from "./hello";
import { postResolver } from "./post";
import { userResolver } from "./user";

const resolvers = [helloResolver, postResolver, userResolver];

export default resolvers;
