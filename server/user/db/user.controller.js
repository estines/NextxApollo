// Passport Configuration
import passport from 'passport';
import { setup } from '../../auth/local/passport';
import {
  refreshToken,
  signToken,
  verifyJWT
} from '../../auth/auth.service';
import User from "./user.model";

setup(User);

const userController = {
	users: (root, args) => {
    return User.find({});
  },
	signup: async (gUser) => {
		const { email, username, password } = gUser;
		const newUser = new User({ email, username, password });
		const user = await newUser.save();

    return {
      ...user.profile,
      token: signToken(user.signtoken),
      rtoken: refreshToken(user)
    };
	},
	signin: async (gUser) => {
		const result = await new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        const error = err || info;
        if (error) {
          reject(error);
          return;
        }
        if (!user) {
          reject({message: 'Something went wrong, please try again.'});
          return;
        }

        resolve({
					...user.profile,
					token: signToken(user.signtoken),
          rtoken: refreshToken(user)
				});
      })({ body: gUser });
    });
    return result;
	},
  signout: (user) => {
    return User.findOneAndUpdate({ _id: user._id }, { rtoken: '' }, { new: true });
  },
  verifyToken: async (token) => {
    if (!token) {
			return { authorized: false };
		}

    try {
      return await verifyJWT(token);
    } catch (err) {
      return { authorized: false, error: err };
    }
  },
  token: async (data) => {
    const user = await User.findOne({ username: data.username, rtoken: data.refreshToken });
    if (!user) {
      throw new Error("User not found.");
    }

    return ({
      ...user.profile,
      token: signToken(user.signtoken),
      rtoken: user.rtoken
    });
  }
};

export { userController };
