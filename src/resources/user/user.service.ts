import { Repository } from 'typeorm';
import { AppDataSource } from '@/utils/database';
import User from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.interface';
import { ConflictException, NotFoundException, ServerException } from '@/utils/exceptions';
import logger from '@/utils/logger';

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Create a new user
   */
  public async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error: any) {
      // PostgreSQL unique violation error code
      if (error.code === '23505') {
        throw new ConflictException('User with this email');
      }
      throw new ServerException('Unable to create user');
    }
  }

  /**
   * Find all users
   */
  public async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new ServerException('Unable to find users');
    }
  }

  /**
   * Find user by ID
   */
  public async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServerException('Unable to find user');
    }
  }

  /**
   * Update user
   */
  public async update(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const result = await this.userRepository.update(id, userData);

      if (result.affected === 0) {
        throw new NotFoundException('User');
      }

      return await this.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServerException('Unable to update user');
    }
  }

  /**
   * Delete user
   */
  public async delete(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException('User');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServerException('Unable to delete user');
    }
  }
}

export default UserService;
