import UserSchema, { User } from "../schemas/user"
import { Logger } from "../services/logger"

export interface UserRepository {
  createUser(user: User): Promise<User>
  findUserByUsername(username: string): Promise<User | null>
}

export class AppUserRepository implements UserRepository {
  
  constructor(
    private logger: Logger
  ) {}

  async createUser(user: User): Promise<User> {
    try {
      const newUser = new UserSchema({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role,
      })
      
      return await newUser.save()
    } catch (error) {
      this.logger.error(`Error creating new user: ${error}`)
      throw error
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await UserSchema.findOne({ username })
  }
}