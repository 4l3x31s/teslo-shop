import { Res, UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: {fileSize: 1000},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){
    if(!file){
      throw new BadRequestException("Error al cargar imagen");
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
     
    return {secureUrl};
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    if(!path){
      throw new BadRequestException("Error al cargar imagen");
    }
    res.sendFile(path);
  }
}
