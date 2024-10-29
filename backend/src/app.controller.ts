import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/exercises')
  async getExercises(): Promise<any[]> {
    console.log("Получение упражнений");
    return await this.appService.getAllExercises();
  }

  @Post('/exercises')
  async addExercise(@Body() exercise: any): Promise<any> {
    console.log("Добавление нового упражнения:", exercise);
    return await this.appService.addExercise(exercise);
  }
}
