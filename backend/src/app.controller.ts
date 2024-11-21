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
  Res, UploadedFiles,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilterParams, FilterReviews } from './types/filter';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'node:path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('/statistics')
  async getStatistics(@Body() body: any) {
    // Данные из formData будут содержать текстовые поля
    const { type, date, exercise_id } = body;
    console.log('type', body);
    console.log('date', date);
    console.log('exercise_id', exercise_id);

    // Если date приходит как строка, нужно преобразовать его в объект
    const parsedDate = JSON.parse(date); // Преобразуем строку в объект, если она пришла как строка

    switch (type) {
      case 'DYNAMIC':
        return await this.appService.getDynamicStatistics(parsedDate, exercise_id);
      // Другие типы статистики, если они будут добавлены:
      // case 'STARS':
      //   return await this.getStarsStatistics(parsedDate, exercise_id);
      // case 'ASANAS_COUNT':
      //   return await this.getAsanasCountStatistics(parsedDate, exercise_id);
      // case 'REVIEWS_COUNT':
      //   return await this.getReviewsCountStatistics(parsedDate, exercise_id);
      // case 'PERCENT':
      //   return await this.getPercentStatistics(parsedDate, exercise_id);
      default:
        throw new Error('Неизвестный тип статистики');
    }
  }

  @Post('/import')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response
  ) {
    try {
      // Проверяем, что пришли все три файла
      const requiredFiles = ['images.files.bson', 'images.chunks.bson', 'exercises.bson'];
      const uploadedFiles = files.map((file) => file.originalname);

      for (const requiredFile of requiredFiles) {
        if (!uploadedFiles.includes(requiredFile)) {
          return res.status(400).json({ message: `Missing file: ${requiredFile}` });
        }
      }

      // Сохраняем файлы временно на диск
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      for (const file of files) {
        const filePath = path.join(tempDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
      }

      // Импортируем данные в базу
      await this.appService.importDataFromFiles(
        path.join(tempDir, 'images.files.bson'),
        path.join(tempDir, 'images.chunks.bson'),
        path.join(tempDir, 'exercises.bson')
      );

      console.log('success');
      return res.status(200).json({ message: 'Files uploaded and data imported successfully' });
    } catch (error) {
      console.error('Error during file upload and import:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
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


