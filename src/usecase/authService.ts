import { SigninCredential, SignupCredential } from "../domain/entity/userCredential";
import { UserRepository } from "../domain/repository/userRepository";
import * as jwt from "jsonwebtoken";
import { firebaseAuth } from "../firebase";
import { User } from "../domain/entity/user";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LOGGER } from "../logging";

export class AuthService {
    readonly TOKEN_EXPIRE_TIME = "10m";
    private userRepository: UserRepository

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async signIn(credentialFromRequest: SigninCredential)
        : Promise<{
            displayName: string,
            token: string
        }> {
        const userId: string = firebaseAuth.currentUser?.uid!
        const authenticatedUser = await this.userRepository.findById(userId);
        // 1 jwtのtokenを作成
        const payload = { user: credentialFromRequest };
        const token = jwt.sign(payload, process.env.JWT_PRIVATE as string, {
            expiresIn: this.TOKEN_EXPIRE_TIME,
        });
        LOGGER.debug("[AuthService::signIn] Token generated.");
        return {
            displayName: authenticatedUser.displayName,
            token: token
        };
    }

    async signUp(credentialFromRequest: SignupCredential)
        : Promise<{
            displayName: string,
            token: string
        }> {
        const registeredCredential = await createUserWithEmailAndPassword(firebaseAuth, credentialFromRequest.email, credentialFromRequest.password);
        LOGGER.debug("[AuthService::signUp] New user created.");
        LOGGER.debug(`[AuthService::signUp] Email: ${credentialFromRequest.email}`);
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
        LOGGER.debug("[AuthService::signUp] Token generated.");
        return {
            displayName: credentialFromRequest.displayName,
            token: token
        };
    }
}