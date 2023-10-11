import {Body, Controller, Get, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileService} from './file.service';
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";

@Controller()
export class AppController {
    constructor(/*private readonly appService: FileService*/) {
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder: string,
    ) {
        console.log(file);
        console.log(folder);
    }
}
