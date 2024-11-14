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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/exportImageFiles')
  async downloadFiles(@Res() res: Response) {
    try {
      const filePath = await this.appService.getImagesFiles();
      if (fs.existsSync(filePath)) {
        const fileSize = fs.statSync(filePath).size;

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=collectionImageFiles.bson');
        res.setHeader('Content-Length', fileSize);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          console.log('Файл успешно отправлен на фронтенд.');
        });

        fileStream.on('error', (err) => {
          console.error('Ошибка при чтении файла:', err);
          res.status(500).send('Ошибка при отправке файла');
        });
      } else {
        console.log('Файл не найден.');
        res.status(404).send('Файл не найден');
      }
    } catch (error) {
      console.error('Ошибка при отправке файла:', error);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  }

  @Get('/exportImageChunks')
  async downloadChunks(@Res() res: Response) {
    try {
      const filePath = await this.appService.getImagesChunks();
      if (fs.existsSync(filePath)) {
        const fileSize = fs.statSync(filePath).size;
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=collectionImageChunks.bson');
        res.setHeader('Content-Length', fileSize);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          console.log('Файл успешно отправлен на фронтенд.');
        });

        fileStream.on('error', (err) => {
          console.error('Ошибка при чтении файла:', err);
          res.status(500).send('Ошибка при отправке файла');
        });
      } else {
        console.log('Файл не найден.');
        res.status(404).send('Файл не найден');
      }
    } catch (error) {
      console.error('Ошибка при отправке файла:', error);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  }

  @Get('/exportExercises')
  async downloadExercises(@Res() res: Response) {
    try {
      const filePath = await this.appService.getExercisesFile();
      if (fs.existsSync(filePath)) {
        const fileSize = fs.statSync(filePath).size;
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=collectionExercises.bson');
        res.setHeader('Content-Length', fileSize);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          console.log('Файл успешно отправлен на фронтенд.');
        });

        fileStream.on('error', (err) => {
          console.error('Ошибка при чтении файла:', err);
          res.status(500).send('Ошибка при отправке файла');
        });
      } else {
        console.log('Файл не найден.');
        res.status(404).send('Файл не найден');
      }
    } catch (error) {
      console.error('Ошибка при отправке файла:', error);
      res.status(500).send('Внутренняя ошибка сервера');
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
  @UseInterceptors(FileInterceptor('img'))
  async addExercise(
    @UploadedFile() file: Express.Multer.File,
    @Body() exerciseData: any,
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


