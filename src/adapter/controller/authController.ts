import express from 'express';
import { AuthService } from '../../usecase/authService';
import { UserRepositoryMysql } from '../../infrastructure/repository/mysql/userRepositoryMysql';
import passport from '../../infrastructure/authentication/authentication';
import { SigninCredential, SignupCredential } from '../../domain/entity/userCredential';

const router = express.Router()
const authService = new AuthService(new UserRepositoryMysql)

// TODO sign in のAPIをPOSTに戻す
router.post("/signin",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    const credential: SigninCredential = req.body;
    const token = await authService.signIn(credential);
    return res.status(200).json({
      message: "Signin Succeeded.",
      token: token
    });
  })

router.post("/signup", async (req, res) => {
  const credential: SignupCredential = req.body;
  const token = await authService.signUp(credential);
  return res.status(200).json({
    message: 'Sign up succeeded.',
    token: token
  });
})

export const authRouter = router;