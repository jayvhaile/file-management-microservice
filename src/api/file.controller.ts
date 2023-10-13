import { Body, Controller, Get, HttpException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "../file.service";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) {
  }


  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("folder") folder: string,
    @Body("referenceId") referenceId: string
  ) {
    if (!file) throw new HttpException("file required!", 400);
    if (!folder) throw new HttpException("folder required!", 400);
    if (!referenceId) throw new HttpException("referenceId required!", 400);

    const result = await this.fileService.upload({
      data: file.buffer,
      folder: folder,
      mimeType: file.mimetype,
      name: file.originalname,
      referenceId: referenceId
    });

    return result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();
  }

  @Get("download-direct/:id")
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


  @Get("reference/:referenceId/exists")
  async existsByReference(
    @Param("referenceId") referenceId: string
  ) {
    if (!referenceId) throw new HttpException("No referenceId", 400);

    return this.fileService.existsByReferenceId(referenceId);
  }

  @Get(":id/exists")
  async existsById(
    @Param("id") id: string
  ) {
    if (!id) throw new HttpException("No id", 400);
    return this.fileService.existsById(id);
  }

  @Get("download/:id")
  async downloadById(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    if (!id) throw new HttpException("No id", 400);

    const result = await this.fileService.getDownloadUrlById(id);
    const url = result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();

    res.redirect(url);
  }

  @Get("download/reference/:id")
  async downloadByReference(
    @Param("id") id: string,
    @Res() res: Response
  ) {
    if (!id) throw new HttpException("No id", 400);

    const result = await this.fileService.getDownloadUrlByReferenceId(id);

    const url = result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();

    res.redirect(url);
  }


  @Get("download-url/reference/:id")
  async downloadUrlByReference(
    @Param("id") id: string
  ) {
    if (!id) throw new HttpException("No id", 400);

    const result = await this.fileService.getDownloadUrlByReferenceId(id);

    return result
      .mapLeft(failure => new HttpException(failure, 400))
      .unsafeCoerce();
  }
}
