import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';

@Module({
  imports: [DatabaseModule, TodoModule, AuthModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
