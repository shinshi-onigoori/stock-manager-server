import { signInWithEmailAndPassword } from "firebase/auth"
import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { firebaseAuth } from "../../firebase";
import { LOGGER } from "../../logging";

// 1 passport-localの設定
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    (username: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void) => {
      signInWithEmailAndPassword(firebaseAuth, username, password)
        .then((userCredential) => {
          // Signed in
          LOGGER.debug("[authentication][LocalStrategy] Authentication succeeded.")
          LOGGER.debug(`[authentication][LocalStrategy] UID: ${userCredential.user.uid}`)
          return done(null, username);
        })
        .catch((error) => {
          LOGGER.error("[authentication][LocalStrategy] Authentication failed.")
          LOGGER.debug(`[authentication][LocalStrategy] Error: ${error}`)
          return done(null, false, {
            message: "メールアドレスまたはパスワードが違います",
          })
        });
    }
  )
);

// 2 passport-jwtの設定
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_PRIVATE,
};

passport.use(
  new JWTStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
  })
);

// 3 passportをexport
export default passport;