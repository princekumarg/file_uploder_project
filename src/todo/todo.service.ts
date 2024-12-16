import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTodoDto: CreateTodoDto, email: string, imageUrl?: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      let data: Prisma.TodoCreateInput = {
        description: createTodoDto.description,
        task: createTodoDto.task,
        status: 'ACTIVE',
        image: imageUrl || null, // Handle optional image field
        user: {
          connect: { email: user.email },
        },
      };

      return this.databaseService.todo.create({ data });
    } catch (err) {
      return err;
    }
  }

  async findAll(userEmail: string) {
    return this.databaseService.todo.findMany({
      where: {
        userEmail: userEmail,
      },
    });
  }

  async findOne(id: string) {
    return this.databaseService.todo.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, imageUrl?: string) {
    return this.databaseService.todo.update({
      where: {
        id: id,
      },
      data: {
        ...updateTodoDto,
        image: imageUrl || updateTodoDto.image || null, // Update image field if provided
      },
    });
  }

  async remove(id: string) {
    return this.databaseService.todo.delete({
      where: {
        id: id,
      },
    });
  }
}
