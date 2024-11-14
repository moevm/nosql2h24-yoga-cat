import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilterParams, FilterReviews } from './types/filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import JSZip from 'jszip';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/export')
  async downloadFile(@Res() res: Response) {
    try {
      const filePath = await this.appService.getImagesChunks();

      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=collection.bson');

        // Отправляем файл полностью, используя `res.download()`
        res.download(filePath, 'collection.bson', (err) => {
          if (err) {
            console.error('Error while downloading file:', err);
            res.status(500).send('Error downloading file');
          }
        });
      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error('Error while sending file:', error);
      res.status(500).send('Internal Server Error');
    }
  }


  @Get('/exercises')
  async getFilteredExercises(@Query() filterParams: FilterParams): Promise<any> {
    return await this.appService.getFilteredExercises(filterParams);
  }
  @Get('/exercisesAll')
  async getAllExercises(): Promise<any> {
    return await this.appService.getAllExercises();
  }
  @Get('/exercises/:id')
  async getExercise(@Param('id') id: string): Promise<any> {
    return await this.appService.getExerciseById(id);
  }


  @Post('/exercises')
  @UseInterceptors(FileInterceptor('img')) // 'img' - это имя поля в FormData
  async addExercise(
    @UploadedFile() file: Express.Multer.File, // Здесь мы получаем файл
    @Body() exerciseData: any, // Здесь будут остальные поля формы
  ) {
    return this.appService.addExercise(file, exerciseData);
  }

  @Put('/exercises/:id')
  @UseInterceptors(FileInterceptor('img'))
  async updateExercise(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() exerciseData: any,
  ) {
    return this.appService.updateExercise(id, file, exerciseData);
  }

  @Put('/exercises/:id/review')
  async addReviewToExercise(
    @Param('id') id: string,
    @Body() review: any, // Получаем отзыв из тела запроса
  ) {
    console.log("Добавление отзыва к упражнению с ID:", id, "Отзыв:", review);
    return await this.appService.addReviewToExercise(id, review);
  }

  @Get('/exercises/:id/review')
  async getReviews(@Param('id') id: string): Promise<any> {
    console.log("Получение отзывов упражнения с ID:", id);
    return await this.appService.getReviews(id);
  }

  @Delete('/exercises/:id')
  async deleteExercise(@Param('id') id: string): Promise<any> {
    console.log("Удаление упражнения с ID:", id);
    return await this.appService.deleteExercise(id);
  }

  @Get('/reviewfilter')
  async getReviewsByText(@Query() filterParams: FilterReviews): Promise<any> {
    return await this.appService.getReviewsByText(filterParams);
  }


  @Get('/popular')
  async getPopular(): Promise<any> {
    return await this.appService.getPopular();
  }

}


