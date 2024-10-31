import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import { FilterParams } from './types/filter';

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

  async getFilteredExercises(filterParams: FilterParams): Promise<any[]> {
    try {
      const collection = this.db.collection('exercises');
      const query: any[] = [];

      console.log('filt', filterParams);

      if (filterParams.name && filterParams.name.length > 0) {
        query.push({ 'properties.title': { $in: [filterParams.name] } });
      }
      if (filterParams.spine && filterParams.spine.length > 0) {
        query.push({ 'properties.spine': { $in: Array.isArray(filterParams.spine) ? filterParams.spine: [filterParams.spine] } });
      }
      if (filterParams.positionInSpace && filterParams.positionInSpace.length > 0) {
        query.push({ 'properties.positionInSpace': { $in: Array.isArray(filterParams.positionInSpace) ? filterParams.positionInSpace : [filterParams.positionInSpace] } });
      }
      if (filterParams.loadAccent && filterParams.loadAccent.length > 0) {
        query.push({ 'properties.loadAccent': { $in: Array.isArray(filterParams.loadAccent) ? filterParams.loadAccent : [filterParams.loadAccent]} });
      }
      if (filterParams.periphery && filterParams.periphery.length > 0) {
        query.push({ 'properties.periphery': { $in: Array.isArray(filterParams.periphery) ? filterParams.periphery : [filterParams.periphery] } });
      }
      if (filterParams.stars && filterParams.stars.length > 0) {
        query.push({ 'properties.stars': { $in: Array.isArray(filterParams.stars) ? filterParams.stars: [filterParams.stars] } });
      }

      const finalQuery = {
        $or: [...query]
      };

      const exercises = await collection.find(finalQuery.$or.length > 0 ? finalQuery : {}).toArray();
      console.log('Полученные упражнения:', exercises);
      return exercises;
    } catch (error) {
      console.error('Ошибка при получении отфильтрованных упражнений:', error);
      return [];
    }
  }


  async getExerciseById(id: string): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      const exercise = await collection.findOne({ _id: new ObjectId(id) }); // Здесь используем ObjectId
      return exercise;
    } catch (error) {
      console.error('Ошибка при получении упражнения по ID:', error);
      return null;
    }
  }


  getHello(): string {
    return 'Hello World!';
  }
}
