const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const { secret } = require('../config');

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// verify this username and password, call done with the user..
	// if it is the correct email and password
	// otherwise, call done with false
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				return done(null, false);
			}
			// compare passwords - is 'password' equal to user.password?
			user.comparePassword(password, function(err, isMatch) {
				if (err) return done(err);

				if (!isMatch) return done(null, false);

				return done(null, user);
			});
		})
		.catch(done);
});

// setup options for JWT strategy
const jwtOptions = {
	// tell passport to look for an header called authorization to find the token
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// payload is the decoded jwt token (userid & issuetime)
	// see if the user id in the payload exists in our database
	// if it does, call 'done' with the user object
	// otherwise, call done without a user object
	User.findById(payload.sub, function(err, user) {
		if (err) return done(err, false);

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
