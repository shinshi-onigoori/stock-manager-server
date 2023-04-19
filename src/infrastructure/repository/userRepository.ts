import { User } from "../../domain/entity/user"
export class UserRepository {
    private constructor() { }
    
    private table = "user";

    static findById(): User {
        return {
            id: "user",
            hashedPassword: "password"
        }
    }
}