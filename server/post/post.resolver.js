import { pubsub } from "../common/pubsub";
import { authenticate } from '../auth/auth.service';
import { postController } from "./db/post.controller";

const POST_ADDED = "POST_ADDED";

const postResolver = {
	Subscription: {
		posts: {
			subscribe: () => pubsub.asyncIterator([POST_ADDED])
		}
	},
	Query: {
		posts(root, args, context) {
			authenticate(context);
			return postController.gets();
		}
	},
	Mutation: {
		async addPost(root, args, context) {
			authenticate(context);
			const result = await postController.insert(args);
			pubsub.publish(POST_ADDED, { posts: result });
			return result;
		}
	}
};

export { postResolver };
