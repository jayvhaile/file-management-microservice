import { Body, Controller, Get, HttpException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "../file.service";
import { Response } from "express";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {
  }


  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("folder") folder: string
  ) {
    if (!file) throw new HttpException("No file", 400);
    if (!folder) throw new HttpException("No folder", 400);

    const result = await this.fileService.upload({
      data: file.buffer,
      folder: folder,
      mimeType: file.mimetype,
      name: file.originalname
    });
    return result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();
  }

  @Get("download/:id")
  async downloadFile(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    if (!id) throw new HttpException("No id", 400);

    const result = await this.fileService.download(id);
    const file = result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
    res.setHeader("Content-Length", file.size);
    res.send(file.data);
  }

  @Get("download-url/:id")
  async downloadUrl(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    if (!id) throw new HttpException("No id", 400);

    const result = await this.fileService.getDownloadUrl(id);
    const url = result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();

    res.redirect(url);
  }
}
