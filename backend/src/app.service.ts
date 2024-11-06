import { Injectable, OnModuleInit } from '@nestjs/common';
import { BSON, MongoClient, ObjectId, GridFSBucket, GridFSBucketWriteStream} from 'mongodb';
import * as fs from 'fs';
import { FilterParams } from './types/filter';
import * as path from 'path';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly uri = 'mongodb://127.0.0.1:27017';
  private db: any;
  private gridFSBucket: GridFSBucket;

  async onModuleInit() {
    const client = new MongoClient(this.uri);
    await client.connect();
    this.db = client.db('yoga_catalog');
    this.gridFSBucket = new GridFSBucket(this.db, { bucketName: 'images' });
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

  async addExercise(file: Express.Multer.File, exerciseData: any): Promise<any> {
    try {
      // Проверка на наличие файла
      if (!file) {
        throw new Error('Файл не найден');
      }

      // Создание потока для загрузки файла в GridFS
      const uploadStream = this.gridFSBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      // Ожидаем завершения загрузки
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
        uploadStream.write(file.buffer);
        uploadStream.end();
      });

      // Получаем ID файла в GridFS
      const fileId = uploadStream.id;

      // Создаем объект для добавления в коллекцию 'exercises'
      const exercise = {
        title: exerciseData.title,
        description: exerciseData.description,
        technique: exerciseData.technique,
        contraindications: JSON.parse(exerciseData.contraindications || '[]'),
        benefit: JSON.parse(exerciseData.benefit || '[]'),
        properties: JSON.parse(exerciseData.properties || '{}'),
        reviews: JSON.parse(exerciseData.reviews || '[]'),
        img: fileId, // Сохраняем только ID изображения в GridFS
      };

      // Вставляем упражнение в коллекцию 'exercises'
      const collection = this.db.collection('exercises');
      const result = await collection.insertOne(exercise);

      //console.log('Упражнение успешно добавлено:', result);
      return exercise;
    } catch (error) {
      console.error('Ошибка при добавлении упражнения:', error);
      throw error;
    }
  }


  async getImageById(imageId: string): Promise<Buffer | null> {
    try {
      //console.log("aaaa", imageId);

      // Проверка, что imageId — это валидная строка, представляющая ObjectId
      if (!ObjectId.isValid(imageId)) {
        throw new Error('Невалидный ID изображения');
      }

      const objectId = new ObjectId(imageId);

      const fileStream = this.gridFSBucket.openDownloadStream(objectId);
      const chunks: Buffer[] = [];

      return new Promise<Buffer>((resolve, reject) => {
        fileStream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        fileStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });

        fileStream.on('error', (error) => {
          console.error('Ошибка при загрузке изображения из GridFS:', error);
          reject(null);
        });
      });
    } catch (error) {
      console.error('Ошибка при получении изображения по ID:', error);
      return null;
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

      // Фильтрация по параметрам
      if (filterParams.name && filterParams.name.length > 0) {
        query.push({ 'title': { $regex: filterParams.name, $options: 'i' } });
      }

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

      const finalQuery = { $or: [...query] };

      const page = filterParams.page || 1;
      const limit = 6;
      const skip = (page - 1) * limit;

      const totalExercises = await collection.countDocuments(finalQuery.$or.length > 0 ? finalQuery : {});
      const totalPages = Math.ceil(totalExercises / limit);

      const exercises = await collection.find(finalQuery.$or.length > 0 ? finalQuery : {})
        .skip(skip)
        .limit(limit)
        .toArray();

      // Добавление изображения в каждый элемент
      for (let exercise of exercises) {
        if (exercise.img) {
          const imageBuffer = await this.getImageById(exercise.img.toString()); // Получаем изображение по ID из GridFS
          if (imageBuffer) {
            //exercise.image = imageBuffer.toString('base64'); // Преобразуем изображение в base64
            exercise.img = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`

          }
        }
      }

      return {
        exercises,
        pagination: { totalPages, currentPage: page },
      };
    } catch (error) {
      console.error('Ошибка при получении отфильтрованных упражнений:', error);
      return { exercises: [], pagination: { totalPages: 0, currentPage: 0 } };
    }
  }


  async updateExercise(id: string, file: Express.Multer.File, exerciseData: any): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      console.log("Обновление упражнения с ID:", id, exerciseData);

      // Извлекаем поля из Body
      const title = exerciseData.title as string;
      const description = exerciseData.description as string;
      const technique = exerciseData.technique as string;

      // Преобразуем данные обратно в массивы
      const contraindications = JSON.parse(exerciseData.contraindications as string) as string[];
      const benefit = JSON.parse(exerciseData.benefit as string) as string[];
      const properties = JSON.parse(exerciseData.properties as string);

      // Обрабатываем файл изображения, если он доступен
      let imgId: ObjectId | null = null;
      if (file) {
        // Создание потока для загрузки файла в GridFS
        const uploadStream = this.gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        // Ожидаем завершения загрузки
        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
          uploadStream.write(file.buffer);
          uploadStream.end();
        });

        // Получаем ID файла в GridFS
        imgId = uploadStream.id;
      }

      // Формируем объект обновлений динамически
      const updatedExercise: any = {};

      if (title) updatedExercise.title = title;
      if (description) updatedExercise.description = description;
      if (technique) updatedExercise.technique = technique;
      if (contraindications) updatedExercise.contraindications = contraindications;
      if (benefit) updatedExercise.benefit = benefit;
      if (properties) updatedExercise.properties = properties;
      if (imgId) updatedExercise.img = imgId;

      // Проверяем, есть ли что-то для обновления
      if (Object.keys(updatedExercise).length === 0) {
        throw new Error('Нет данных для обновления');
      }

      // Обновляем упражнение в коллекции 'exercises'
      const result = await collection.updateOne(
        { _id: new ObjectId(id) }, // Фильтр для поиска по ID
        { $set: updatedExercise } // Обновляем только те поля, которые есть в updatedExercise
      );

      console.log('Упражнение успешно обновлено:', result);

      if (result.modifiedCount === 0) {
        throw new Error('Упражнение не найдено или не изменено');
      }

      // Получаем обновленное упражнение с новым изображением
      const updated = await collection.findOne({ _id: new ObjectId(id) });

      if (updated && updated.img) {
        const imageBuffer = await this.getImageById(updated.img.toString()); // Получаем изображение по ID из GridFS
        if (imageBuffer) {
          updated.img = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        }
      }

      return updated;
    } catch (error) {
      console.error('Ошибка при обновлении упражнения:', error);
      throw error;
    }
  }



  async getExerciseById(id: string): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      const exercise = await collection.findOne({ _id: new ObjectId(id) }); // Здесь используем ObjectId

      if (exercise && exercise.img) {
        const imageBuffer = await this.getImageById(exercise.img.toString()); // Получаем изображение по ID из GridFS
        if (imageBuffer) {
          // Преобразуем изображение в base64 и добавляем префикс для изображения
          exercise.img = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        }
      }

      return exercise;
    } catch (error) {
      console.error('Ошибка при получении упражнения по ID:', error);
      return null;
    }
  }

  async addReviewToExercise(exerciseId: string, reviewData: any): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      const review = {
        name: reviewData.name,
        age: reviewData.age,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date() // добавляем текущую дату
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(exerciseId) },
        { $push: { reviews: review } }
      );

      console.log('Отзыв успешно добавлен к упражнению:', result);

      if (result.modifiedCount === 0) {
        throw new Error('Упражнение не найдено или не изменено');
      }

      return review;
    } catch (error) {
      console.error('Ошибка при добавлении отзыва к упражнению:', error);
      throw error;
    }
  }


  async getReviews(id: string): Promise<any[]> {
    try {
      const collection = this.db.collection('exercises');
      const exercise = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { reviews: 1 } } // Выбираем только поле `reviews`
      );

      if (!exercise) {
        console.error(`Упражнение с ID ${id} не найдено`);
        return [];
      }

      console.log("Полученные отзывы:", exercise.reviews);
      return exercise.reviews || [];
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      return [];
    }
  }


  getHello(): string {
    return 'Hello World!';
  }
}
