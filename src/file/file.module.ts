import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register(FileService.uploadOptions)],
  providers: [FileService],
})
export class FileModule {}
