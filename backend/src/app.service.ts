import { Injectable, OnModuleInit } from '@nestjs/common';
import { BSON, MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import { FilterParams } from './types/filter';
import * as path from 'path';

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

  // async addExercise(exercise: any): Promise<any> {
  //   try {
  //     const collection = this.db.collection('exercises');
  //     const result = await collection.insertOne(exercise);
  //     console.log('Упражнение успешно добавлено:', result);
  //     await this.saveExerciseToFile(exercise);
  //     return exercise;
  //   } catch (error) {
  //     console.error('Ошибка при добавлении упражнения:', error);
  //     throw error;
  //   }
  // }

  async addExercise(file: Express.Multer.File, exerciseData: any): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      console.log("Полученные данные упражнения:", exerciseData);

      // Извлекаем поля из Body
      const title = exerciseData.title as string;
      const description = exerciseData.description as string;
      const technique = exerciseData.technique as string;

      // Преобразуем данные обратно в массивы
      const contraindications = JSON.parse(exerciseData.contraindications as string) as string[];
      const benefit = JSON.parse(exerciseData.benefit as string) as string[];
      const properties = JSON.parse(exerciseData.properties as string);
      const reviews = JSON.parse(exerciseData.reviews as string) as any[]; // Укажите подходящий тип для отзывов

      // Обрабатываем файл изображения, если он доступен
      let imgBuffer: Buffer | null = null;
      if (file) {
        imgBuffer = file.buffer; // Используем буфер из загруженного файла
      }

      // Теперь создаем объект для добавления в базу данных
      const exercise = {
        title,
        description,
        technique,
        contraindications,
        benefit,
        properties,
        reviews,
        img: imgBuffer // Добавляем двоичные данные изображения
      };

      const result = await collection.insertOne(exercise);
      console.log('Упражнение успешно добавлено:', result);

      // Сохраняем упражнение в BSON-файл
      await this.saveExerciseToFile(exercise);
      return exercise;
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
      throw error;
    }
  }



  private async saveExerciseToFile(exercise: any): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '../src/data/yoga.bson');
      let exercises = [];

      if (fs.existsSync(filePath)) {
        const existingData = fs.readFileSync(filePath);
        exercises = existingData.length ? BSON.deserialize(existingData).exercises || [] : [];
      }

      // Добавляем новое упражнение в массив упражнений
      exercises.push(exercise);

      // Сериализация и запись данных обратно в BSON файл
      const bsonData = BSON.serialize({ exercises });
      fs.writeFileSync(filePath, bsonData);
      console.log('Новое упражнение успешно сохранено в BSON файл.');
    } catch (error) {
      console.error('Ошибка при записи упражнения в BSON файл:', error);
    }
  }

  async getFilteredExercises(filterParams: FilterParams): Promise<{ exercises: any[]; pagination: { totalPages: number, currentPage: number } }> {
    try {
      const collection = this.db.collection('exercises');
      const query: any[] = [];

      console.log('filt', filterParams);

      // if (filterParams.name && filterParams.name.length > 0) {
      //   query.push({ 'title': { $in: Array.isArray(filterParams.name) ? filterParams.name : [filterParams.name] } });
      // }

      if (filterParams.name && filterParams.name.length > 0) {
        query.push({ 'title': { $regex: filterParams.name, $options: 'i' } });
      }

      console.log("name",filterParams.name );
      if (filterParams.spine && filterParams.spine.length > 0) {
        query.push({ 'properties.spine': { $in: Array.isArray(filterParams.spine) ? filterParams.spine : [filterParams.spine] } });
      }
      if (filterParams.positionInSpace && filterParams.positionInSpace.length > 0) {
        query.push({ 'properties.positionInSpace': { $in: Array.isArray(filterParams.positionInSpace) ? filterParams.positionInSpace : [filterParams.positionInSpace] } });
      }
      if (filterParams.loadAccent && filterParams.loadAccent.length > 0) {
        query.push({ 'properties.loadAccent': { $in: Array.isArray(filterParams.loadAccent) ? filterParams.loadAccent : [filterParams.loadAccent] } });
      }
      if (filterParams.periphery && filterParams.periphery.length > 0) {
        query.push({ 'properties.periphery': { $in: Array.isArray(filterParams.periphery) ? filterParams.periphery : [filterParams.periphery] } });
      }
      if (filterParams.stars && filterParams.stars.length > 0) {
        query.push({ 'properties.stars': { $in: Array.isArray(filterParams.stars) ? filterParams.stars : [filterParams.stars] } });
      }

      const finalQuery = {
        $or: [...query]
      };

      console.log("qqqquery", finalQuery);

      // Получение значений для пагинации
      const page = filterParams.page || 1; // Номер страницы по умолчанию 1
      const limit = 6; // Количество записей на странице по умолчанию 6
      const skip = (page - 1) * limit; // Пропускаем записи

      // Получаем общее количество упражнений, соответствующих запросу
      const totalExercises = await collection.countDocuments(finalQuery.$or.length > 0 ? finalQuery : {});
      console.log("total ex", totalExercises);

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalExercises / limit);

      // Получаем упражнения с учетом пагинации
      const exercises = await collection.find(finalQuery.$or.length > 0 ? finalQuery : {})
        .skip(skip)
        .limit(limit)
        .toArray();

      console.log('Полученные упражнения:', exercises);

      // Возвращаем объект с упражнениями и информацией о пагинации
      return {
        exercises,
        pagination: {
          totalPages,
          currentPage: page,
        },

      };
    } catch (error) {
      console.error('Ошибка при получении отфильтрованных упражнений:', error);
      return {
        exercises: [],
        pagination: {
          totalPages: 0,
          currentPage: 0,
        },
      };
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
