import express from 'express';
import { AuthService } from '../../usecase/authService';
import { UserRepositoryMysql } from '../../infrastructure/repository/mysql/userRepositoryMysql';
import passport from '../../infrastructure/authentication/authentication';
import { UserCredential } from '../../domain/entity/userCredential';

const router = express.Router()
const authService = new AuthService(new UserRepositoryMysql)

// TODO sign in のAPIをPOSTに戻す
router.post("/signin",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    const userCredential: UserCredential = req.body;
    const dto = await authService.signIn(userCredential);
    return res.status(200).json({
      message: "Signin Succeeded.",
      token: dto.token,
      user: dto.user
    })
  })

router.post("/signup", (req, res) => {
  authService.signUp();
  return res.status(200).send({
    message: 'API to sign up.',
  })
})

export const authRouter = router;