import { SigninCredential, SignupCredential } from "../domain/entity/userCredential";
import { UserRepository } from "../domain/repository/userRepository";
import * as jwt from "jsonwebtoken";
import { firebaseAuth } from "../firebase";
import { User } from "../domain/entity/user";
import { createUserWithEmailAndPassword } from "firebase/auth";

export class AuthService {
    readonly TOKEN_EXPIRE_TIME = "10m";
    private userRepository: UserRepository

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async signIn(credentialFromRequest: SigninCredential): Promise<string> {
        const userId: string = firebaseAuth.currentUser?.uid!
        const authenticatedUser = await this.userRepository.findById(userId);
        // 1 jwtのtokenを作成
        const payload = { user: credentialFromRequest };
        const token = jwt.sign(payload, process.env.JWT_PRIVATE as string, {
            expiresIn: this.TOKEN_EXPIRE_TIME,
        });
        return token;
    }

    async signUp(credentialFromRequest: SignupCredential): Promise<string> {
        const registeredCredential = await createUserWithEmailAndPassword(firebaseAuth, credentialFromRequest.email, credentialFromRequest.password);
        const newUser: User = {
            id: registeredCredential.user.uid,
            displayName: credentialFromRequest.displayName
        };
        await this.userRepository.create(newUser);
        const user: SigninCredential = {
            password: credentialFromRequest.password,
            email: credentialFromRequest.email
        };
        const payload = { user: user }
        const token = jwt.sign(payload, process.env.JWT_PRIVATE as string, {
            expiresIn: this.TOKEN_EXPIRE_TIME,
        });
        return token;
    }
}