import { AuthenticationError } from "apollo-server";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
	JWT_SECRET
} from "../common/util/secrets";
import User from '../user/db/user.model';

export function authenticate(context, role = undefined) {
	if (!context.authorized) {
		console.error("User not authorized");
		if (context.error && context.error.message) {
			throw new AuthenticationError(context.error.message);
		} else {
			throw new AuthenticationError("You must be logged in.");
		}
	}

	if (role === 'admin' && context.user && context.user.role !== 'admin') {
		throw new AuthenticationError("You not have permission to access.");
	}

	return;
}

export async function verifyJWT(token) {
  return await new Promise((resolve, reject) => {
    jwt.verify(String(token).replace('Bearer ', ''), JWT_SECRET, function(err, decoded) {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    });
  });
}

export function signToken(data) {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: 60 * 60 * 6
  });
}

export function refreshToken(data) {
	const rtoken = crypto.pbkdf2Sync(
			`${data._id} ${data.password}`,
			JWT_SECRET,
			10000,
			100,
			'sha1'
		)
		.toString('base64');

	if(data.rtoken !== rtoken) {
		data.rtoken = rtoken;
		data.save();
	}
	return rtoken;
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = signToken(req.user);
  res.cookie('token', token);
  res.redirect('/');
}
