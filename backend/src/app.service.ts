import { Injectable, OnModuleInit } from '@nestjs/common';
import { BSON, MongoClient, ObjectId, GridFSBucket, GridFSBucketWriteStream } from 'mongodb';
import * as fs from 'fs';
import { FilterParams, FilterReviews } from './types/filter';
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
      const collection = this.db.collection('exercises');

      // Проверка, есть ли уже данные в коллекции
      const existingExercises = await collection.find({}).toArray();
      if (existingExercises.length > 0) {
        console.log('Данные уже существуют в коллекции exercises. Импорт не выполнен.');
        return;
      }
      // Импорт данных из файла images.files.bson    console.log('Импорт данных из images.files.bson...');
      await this.importFiles('src/data/yoga_catalog/images.files.bson', 'images.files');
      // Импорт данных из файла images.chunks.bson    console.log('Импорт данных из images.chunks.bson...');
      await this.importFiles('src/data/yoga_catalog/images.chunks.bson', 'images.chunks');
      // Импорт данных из файла exercises.bson    console.log('Импорт данных из exercises.bson...');
      await this.importFiles('src/data/yoga_catalog/exercises.bson', 'exercises');
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
    }
  }

  private async importFiles(filePath: string, collectionName: string) {
    try {
      const fileData = fs.readFileSync(filePath);
      let offset = 0;
      const documents = [];
      // Чтение каждого документа из файла
      while (offset < fileData.length) {
        const documentSize = fileData.readUInt32LE(offset); // Размер документа
        const documentBuffer = fileData.slice(offset, offset + documentSize); // Извлечение документа
        try {
          const document = BSON.deserialize(documentBuffer); // Десериализация документа
          documents.push(document);
        } catch (error) {
          console.error(`Ошибка при десериализации документа в файле ${filePath}:`, error);
          break;
        }
        offset += documentSize;
      }
      if (documents.length > 0) {
        await this.db.collection(collectionName).insertMany(documents); // Вставка данных в коллекцию      console.log(`Данные успешно импортированы в коллекцию ${collectionName}.`);
      } else {
        console.error(`Не удалось десериализовать документы из ${filePath}.`);
      }
    } catch (error) {
      console.error(`Ошибка при импорте данных из ${filePath}:`, error);
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
        rating: exerciseData.rating,
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


  async getFilteredExercises(filterParams: FilterParams): Promise<{
    exercises: any[];
    pagination: { totalPages: number, currentPage: number }
  }> {
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
            exercise.img = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

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


  async getReviewsByText(filterParams: FilterReviews): Promise<any[]> {
    try {
      if (filterParams.substring == '') {
        return [];
      }
      const collection = this.db.collection('exercises');
      const query = {
        $match: {
          reviews: {
            $elemMatch: {
              comment: { $regex: filterParams.substring, $options: 'i' },
            },
          },
        },
      };

      const pipeline = [
        query,
        {
          $unwind: '$reviews',
        },
        {
          $match: {
            'reviews.comment': { $regex: filterParams.substring, $options: 'i' },
          },
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            reviews: { $push: '$reviews' },
          },
        },
      ];

      const result = await collection.aggregate(pipeline).toArray();

      return result.map((exercise) => ({
        id: exercise._id.toString(),
        title: exercise.title,
        reviews: exercise.reviews,
      }));
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      return [];
    }
  }


  async updateExercise(id: string, file: Express.Multer.File, exerciseData: any): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      console.log('Обновление упражнения с ID:', id, exerciseData);
      const exercise = await collection.findOne({ _id: new ObjectId(id) }); // Здесь используем ObjectId
      console.log('gfefdefs', exercise);
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
        if (exercise.img) {
          const imageId = exercise.img.toString();
          const imageObjectId = new ObjectId(imageId);
          await this.gridFSBucket.delete(imageObjectId);
          console.log(`Изображение с ID ${imageId} удалено из GridFS`);
        }
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
        { $set: updatedExercise }, // Обновляем только те поля, которые есть в updatedExercise
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
        date: new Date(), // добавляем текущую дату
      };

      // Обновляем упражнение, добавляем отзыв и пересчитываем рейтинг
      const exercise = await collection.findOne({ _id: new ObjectId(exerciseId) });
      if (!exercise) {
        throw new Error('Упражнение не найдено');
      }

      // Считаем новый рейтинг
      const totalReviews = exercise.reviews ? exercise.reviews.length : 0;
      const totalRating = exercise.reviews ? exercise.reviews.reduce((acc, review) => acc + review.rating, 0) : 0;
      const newRating = (totalRating + reviewData.rating) / (totalReviews + 1); // новый средний рейтинг

      // Обновляем упражнение: добавляем новый отзыв и обновляем рейтинг
      const result = await collection.updateOne(
        { _id: new ObjectId(exerciseId) },
        {
          $push: { reviews: review },  // Добавляем отзыв в массив
          $set: { rating: newRating },  // Обновляем рейтинг
        },
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


  async getPopular(): Promise<any[]> {
    try {
      const collection = this.db.collection('exercises');
      const popularExercises = await collection.find()
        .sort({ rating: -1 }) // Сортируем по полю rating в порядке убывания
        .limit(6) // Возвращаем только 6 упражнений
        .toArray();

      // Добавление изображения в каждый элемент
      for (let exercise of popularExercises) {
        if (exercise.img) {
          const imageBuffer = await this.getImageById(exercise.img.toString()); // Получаем изображение по ID из GridFS
          if (imageBuffer) {
            // Преобразуем изображение в base64 и добавляем префикс для изображения
            exercise.img = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
          }
        }
      }

      return popularExercises;
    } catch (error) {
      console.error('Ошибка при получении популярных упражнений:', error);
      return [];
    }
  }

  async getReviews(id: string): Promise<any[]> {
    try {
      const collection = this.db.collection('exercises');
      const exercise = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { reviews: 1 } }, // Выбираем только поле `reviews`
      );

      if (!exercise) {
        console.error(`Упражнение с ID ${id} не найдено`);
        return [];
      }

      console.log('Полученные отзывы:', exercise.reviews);
      return exercise.reviews || [];
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
      return [];
    }
  }


  async deleteExercise(id: string): Promise<any> {
    try {
      const collection = this.db.collection('exercises');
      const exercise = await collection.findOne({ _id: new ObjectId(id) });
      if (!exercise) {
        throw new Error('Упражнение не найдено');
      }

      if (exercise.img) {
        const imageId = exercise.img.toString();
        const imageObjectId = new ObjectId(imageId);
        await this.gridFSBucket.delete(imageObjectId);
        console.log(`Изображение с ID ${imageId} удалено из GridFS`);
      }

      await collection.deleteOne({ _id: new ObjectId(id) });
      console.log(`Упражнение с ID ${id} удалено из базы данных`);


      return { message: `Упражнение с ID ${id} успешно удалено` };
    } catch (error) {
      console.error('Ошибка при удалении упражнения:', error);
      throw new Error('Ошибка при удалении упражнения');
    }
  }


  getHello(): string {
    return 'Hello World!';
  }
}
