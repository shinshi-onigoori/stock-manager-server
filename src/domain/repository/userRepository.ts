import { User } from "../entity/user";

export interface UserRepository {
    findById(id: string): Promise<User>
    create(user: User): Promise<void>
    update(user: User): Promise<void>
}