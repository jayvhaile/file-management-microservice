import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from '../file.service';

describe('AppController', () => {
  let appController: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService],
    }).compile();

    appController = app.get<FileController>(FileController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });*/
});
