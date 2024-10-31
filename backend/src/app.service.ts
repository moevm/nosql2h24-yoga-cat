import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly uri = 'mongodb://127.0.0.1:27017';
  private db: any;

  async onModuleInit() {
    const client = new MongoClient(this.uri);
    await client.connect();
    this.db = client.db('yoga_catalog');

    await this.importData();
  }


  private async importData() {
    try {
      const data = fs.readFileSync('src/data/yoga.json', 'utf8');
      const exercises = JSON.parse(data);
      const collection = this.db.collection('exercises');


      const existingExercises = await collection.find({}).toArray();
      if (existingExercises.length > 0) {
        console.log('Данные уже существуют в коллекции exercises. Импорт не выполнен.');
        return;
      }

      await collection.insertMany(exercises.exercises);
      console.log('Данные успешно импортированы');
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
    }
  }

  async getAllExercises(): Promise<any[]> {
    try {
      const collection = this.db.collection('exercises');
      const exercises = await collection.find({}).toArray();
      return exercises;
    } catch (error) {
      console.error('Ошибка при получении упражнений:', error);
      return [];
    }
  }

  async addExercise(exercise: any): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      const result = await collection.insertOne(exercise);
      console.log('Упражнение успешно добавлено:', result);
      return exercise;
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
      throw error;
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
