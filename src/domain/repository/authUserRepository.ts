import { UserCredential } from "../entity/userCredential";

export interface AuthUserRepository{
    create(userCredential:UserCredential):void
}