import { authenticate } from '../auth/auth.service';
import { userController } from "./db/user.controller";

const userResolver = {
	Query: {
		users(root, args, context) {
			// check authentication
			// authenticate(context);
			return userController.users(root, args.user);
		}
	},
	Mutation: {
		signup(root, args) {
			return userController.signup(args);
		},
		signin(root, args) {
			return userController.signin(args);
		},
		signout(root, args, context) {
			return userController.signout(context.user);
		},
		token(root, args) {
			return userController.token(args);
		}
	}
};

export { userResolver };
