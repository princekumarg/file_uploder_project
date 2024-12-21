import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserEmail } from '../common/decorators/user-email.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Add a new task with an optional image.',
    summary: 'Add a new Task.',
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @UploadedFile() file: Express.Multer.File,
    @UserEmail() userEmail: string,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : null; // Handle image upload
    return await this.todoService.create(createTodoDto, userEmail, imageUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get all tasks for the authenticated user.',
    summary: 'Get all Tasks.',
  })
  @Get()
  async findAll(@UserEmail() userEmail: string) {
    return await this.todoService.findAll(userEmail);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get details of a specific task by ID.',
    summary: 'Get a Task.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Update a specific task with optional image.',
    summary: 'Update a Task.',
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file?.path || null; // Handle optional image update
    return this.todoService.update(id, updateTodoDto, imageUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Delete a specific task by ID.',
    summary: 'Delete a Task.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
