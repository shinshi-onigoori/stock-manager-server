import { SigninCredential } from "../domain/entity/userCredential";
import { UserRepository } from "../domain/repository/userRepository";
import * as jwt from "jsonwebtoken";
import { firebaseAuth } from "../firebase";
import { User } from "../domain/entity/user";

type SignInDTO = {
    token: string,
    user: User
}

export class AuthService {
    private userRepository: UserRepository
    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async signIn(userCredential: SigninCredential): Promise<SignInDTO> {
        const userId: string = firebaseAuth.currentUser?.uid!
        const authenticatedUser = await this.userRepository.findById(userId);
        // 1 jwtのtokenを作成
        const payload = { user: userCredential };
        const token = jwt.sign(payload, process.env.JWT_PRIVATE as string, {
            expiresIn: "10m",
        });
        return {
            token: token,
            user: authenticatedUser
        };
    }

    signUp(userCredential: SigninCredential) {
        /**
         * TODO
         * ユーザ作成処理作る
         */
        return null;
    }
}