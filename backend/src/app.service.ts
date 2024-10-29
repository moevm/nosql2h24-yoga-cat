import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly uri = 'mongodb://127.0.0.1:27017'; // URI подключения к MongoDB
  private db: any;

  // Метод, который вызывается при инициализации модуля
  async onModuleInit() {
    const client = new MongoClient(this.uri);
    await client.connect();
    this.db = client.db('yoga_catalog'); // Название вашей базы данных

    // Импорт данных из JSON файла
    await this.importData();
  }

  // Метод для импорта данных
  private async importData() {
    try {
      const data = fs.readFileSync('src/data/yoga.json', 'utf8');
      const exercises = JSON.parse(data);
      const collection = this.db.collection('exercises');

      // Проверка на существование данных
      const existingExercises = await collection.find({}).toArray();
      if (existingExercises.length > 0) {
        console.log('Данные уже существуют в коллекции exercises. Импорт не выполнен.');
        return; // Выход из метода, если данные уже существуют
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
      const exercises = await collection.find({}).toArray(); // Получаем все записи
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

  // Простой метод для возврата строки
  getHello(): string {
    return 'Hello World!';
  }
}
