import mongoose from 'mongoose';
import crypto from 'crypto';

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  password: {
    type: String,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  name: {
    type: String
  },
  picture: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  },
  provider: {
    type: String,
    default: 'local'
  },
  salt: String,
  rtoken: String,
  ftoken: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  createdOn: {
    type: Date
  },
  updatedOn: {
    type: Date
  }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      picture: this.picture,
      role: this.role,
      provider: this.provider,
      createdOn: this.createdOn,
      updatedOn: this.updatedOn
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('signtoken')
  .get(function() {
    return {
      _id: this._id,
      role: this.role,
      createdOn: this.createdOn,
      updatedOn: this.updatedOn
    };
  });

// Validate empty username
UserSchema
  .path('username')
  .validate(function(username) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return username.length;
  }, 'Username cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function(value) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }

    return this.constructor.findOne({ username: value }).exec()
      .then((user) => {
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified username is already in use.');

const validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    const self = this;
    const now = new Date();

    if (!self.createdOn) {
      self.createdOn = now;
    } else {
      self.updatedOn = now;
    }

    if (!self.name && self.username) {
      self.name = self.username;
    }

    // Handle new/update passwords
    if (!self.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(self.password)) {
      if (authTypes.indexOf(self.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

    // Make salt with a callback
    self.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      self.salt = salt;
      self.encryptPassword(self.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        self.password = hashedPassword;
        return next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(undefined, true);
      } else {
        return callback(undefined, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(...args) {
    let byteSize;
    let callback;
    const defaultByteSize = 16;

    if (typeof args[0] === 'function') {
      callback = args[0];
      byteSize = defaultByteSize;
    } else if (typeof args[1] === 'function') {
      callback = args[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(undefined, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return undefined;
      } else {
        return callback('Missing password or salt');
      }
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      // eslint-disable-next-line no-sync
      return crypto.pbkdf2Sync(password, salt, defaultIterations,
        defaultKeyLength, 'sha1')
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
      'sha1', (err, key) => {
        if (err) {
          return callback(err);
        } else {
          return callback(undefined, key.toString('base64'));
        }
      });
  }
};

const User = mongoose.model('User', UserSchema);
export default User;
