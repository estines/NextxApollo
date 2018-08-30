import { Post } from "./post.model";

const postController = {
	gets: () => Post.find({}),
	insert: (post) => {
		const newPost = new Post({ author: post.author, comment: post.comment });
		return newPost.save();
	}
};

export { postController };
