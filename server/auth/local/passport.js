import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, username, password, done) {
  User.findOne({
    username: username.toLowerCase()
  }).exec()
    .then(async (user) => {
      if (!user) {
        return done(undefined, false, {
          message: 'Username นี้ยังไม่ถูกลงทะเบียนในระบบ'
        });
      }

      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(undefined, false, { message: 'รหัสผ่านไม่ถูกต้อง' });
        } else {
          return done(undefined, user);
        }
      });
    })
    .catch((err) => done(err));
}

function setup(User) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' // this is the virtual field on the model
  }, function(username, password, done) {
    return localAuthenticate(User, username, password, done);
  }));
}

export { setup };
