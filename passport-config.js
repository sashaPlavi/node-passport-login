const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function init(passport, getUserByEmail, getUserById) {
  const authUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    console.log(getUserByEmail);
    console.log(user);
    console.log(email);

    if (user == null) {
      return done(null, false, { message: "no user whit that email found" });
    }

    try {
      // console.log(password);
      // console.log(user.password);

      if (await bcrypt.compare(password, user.password)) {
        // console.log(user.password);

        return done(null, user);
      } else {
        // console.log("else");

        return done(null, false, { message: "password incorect" });
      }
    } catch (error) {
      // console.log("eror");

      done(error);
    }
  };
  passport.use(new localStrategy({ usernameField: "email" }, authUser));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = init;
