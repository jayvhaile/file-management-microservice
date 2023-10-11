import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
