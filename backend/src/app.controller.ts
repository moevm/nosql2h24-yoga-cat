import { Body, Controller, Get, Delete, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilterParams } from './types/filter';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/exercises')
  async getFilteredExercises(@Query() filterParams: FilterParams): Promise<any> {
    return await this.appService.getFilteredExercises(filterParams);
  }

  @Get('/exercises/:id')
  async getExercise(@Param('id') id: string): Promise<any> {
    console.log("Получение упражнения с ID:", id);
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


}
