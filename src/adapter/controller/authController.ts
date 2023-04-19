import express from 'express';
import { AuthService } from '../../usecase/authService';
import { UserRepositoryMysql } from '../../infrastructure/repository/mysql/userRepositoryMysql';
import passport from '../../infrastructure/authentication/authentication';
import { SigninCredential, SignupCredential } from '../../domain/entity/userCredential';
import { LOGGER } from '../../logging';

const router = express.Router()
const authService = new AuthService(new UserRepositoryMysql)

router.post("/signin",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    LOGGER.debug(`${req.method} -> ${req.url}`);
    const credential: SigninCredential = req.body;
    const result = await authService.signIn(credential);
    return res.status(200).json({
      message: "Signin Succeeded.",
      token: result.token,
      displayName: result.displayName
    });
  })

router.post("/signup", async (req, res) => {
  LOGGER.debug(`${req.method} -> ${req.url}`);
  const credential: SignupCredential = req.body;
  const result = await authService.signUp(credential);
  return res.status(200).json({
    message: 'Sign up succeeded.',
    token: result.token,
    displayName: result.displayName
  });
})

export const authRouter = router;