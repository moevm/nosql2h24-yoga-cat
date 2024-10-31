import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FilterParams } from './types/filter';

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
  async getFilteredExercises(@Query() filterParams: FilterParams): Promise<any[]> {
    console.log('Получение отфильтрованных упражнений:', filterParams);
    return await this.appService.getFilteredExercises(filterParams);
  }

  @Get('/exercises/:id')
  async getExercise(@Param('id') id: string): Promise<any> {
    console.log("Получение упражнения с ID:", id);
    return await this.appService.getExerciseById(id);
  }


  @Post('/exercises')
  async addExercise(@Body() exercise: any): Promise<any> {
    console.log("Добавление нового упражнения:", exercise);
    return await this.appService.addExercise(exercise);
  }
}
