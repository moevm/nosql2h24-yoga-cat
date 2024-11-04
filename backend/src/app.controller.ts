import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
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

  // @Get('/exercises')
  // async getExercises(): Promise<any[]> {
  //   console.log("Получение упражнений");
  //   return await this.appService.getAllExercises();
  // }
  @Get('/exercises')
  async getFilteredExercises(@Query() filterParams: FilterParams): Promise<any> {
    console.log('Получение отфильтрованных упражнений:', filterParams);
    let a = await this.appService.getFilteredExercises(filterParams);
    console.log("ededede", a);
    return a;
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
}
