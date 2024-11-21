<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {computed, ref} from 'vue'
import Logo from "~/shared/ui/Logo.vue";
import NotificationMessages from "~/entities/NotificationMessages.vue";
import BasicButton from '~/shared/ui/BasicButton.vue';
import ModalWindow from '~/entities/ModalWindow.vue'
import { useNotifyStore } from '~/stores/notify'
const isOpenImportWindow = ref(false)
const route = useRoute();
const router = useRouter();
const notifyStore = useNotifyStore()
const isHomePage = computed(() => route.path === '/' || route.path === '/catalog');
const isReviewPage = computed(() => route.path === '/feedback');
const exportData = () => {
  const urlFiles = `http://localhost:8080/exportImageFiles`;
  const urlChunks = `http://localhost:8080/exportImageChunks`;
  const urlExercises = `http://localhost:8080/exportExercises`;

  const fetchFiles = fetch(urlFiles).then((response) => {
    return response.blob();
  });

  const fetchChunks = fetch(urlChunks).then((response) => {
    return response.blob();
  });

  const fetchExercises = fetch(urlExercises).then((response) => {
    return response.blob();
  });

  Promise.all([fetchFiles, fetchChunks, fetchExercises])
    .then(([fileBlob, chunkBlob, exercisesBlob]) => {
      const urlFile = URL.createObjectURL(fileBlob);
      const linkFile = document.createElement('a');
      linkFile.href = urlFile;
      linkFile.download = 'images.files.bson';
      document.body.appendChild(linkFile);
      linkFile.click();
      linkFile.remove();
      URL.revokeObjectURL(urlFile);

      const urlChunk = URL.createObjectURL(chunkBlob);
      const linkChunk = document.createElement('a');
      linkChunk.href = urlChunk;
      linkChunk.download = 'images.chunks.bson';
      document.body.appendChild(linkChunk);
      linkChunk.click();
      linkChunk.remove();
      URL.revokeObjectURL(urlChunk);

      const urlExercises = URL.createObjectURL(exercisesBlob);
      const linkExercises = document.createElement('a');
      linkExercises.href = urlExercises;
      linkExercises.download = 'exercises.bson';
      document.body.appendChild(linkExercises);
      linkExercises.click();
      linkExercises.remove();
      URL.revokeObjectURL(urlExercises);
    })
    .catch((error) => {
      console.error('Ошибка при загрузке файлов:', error);
    });
}
const importData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.bson';
  input.multiple = true;

  input.addEventListener('change', async (event) => {
    isOpenImportWindow.value = false;
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length === 3) {
      const validFiles = ['images.files.bson', 'images.chunks.bson', 'exercises.bson'];
      const selectedFiles = Array.from(files);

      const fileMap: Record<string, File> = {};

      selectedFiles.forEach((file) => {
        if (validFiles.includes(file.name)) {
          fileMap[file.name] = file;
        }
      });

      const isValid = validFiles.every((validName) => fileMap[validName] !== undefined);

      if (isValid) {
        const formData = new FormData();
        formData.append('files', fileMap['images.files.bson'], 'images.files.bson');
        formData.append('files', fileMap['images.chunks.bson'], 'images.chunks.bson');
        formData.append('files', fileMap['exercises.bson'], 'exercises.bson');

        try {
          const response = await fetch('http://localhost:8080/import', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();

          if (response.status === 200) {
            await router.push('/catalog')
            console.log('Файлы успешно загружены и данные импортированы:', result.message);
          } else {
            console.error('Ошибка при загрузке файлов:', result.message);
          }
        } catch (error) {
          console.error('Ошибка при отправке запроса на сервер:', error);
        }
      } else {
        notifyStore.addNotification({
          message: 'Файлы имеют неверные названия.',
          type: 'error',
          id: Date.now(),
        });
      }
    } else {
      notifyStore.addNotification({
        message: 'Необходимо выбрать 3 файла.',
        type: 'error',
        id: Date.now(),
      });
    }
  });


  input.click();
};


</script>

<template>
  <div class="page-wrapper" :class="{reviewPage: isReviewPage}">
    <div class="container">
      <div class="header">
        <NuxtLink to="/" class="logo"><Logo/></NuxtLink>
        <div class="links">
          <NuxtLink to="/catalog" class="links__link">Каталог упражнений</NuxtLink>
        </div>
      </div>
      <div class="page">
        <slot />
      </div>
      <div class="footer"  v-if="isHomePage">
        <BasicButton label="Импортировать данные" class="footer__button" @click="isOpenImportWindow=true"></BasicButton>
        <BasicButton label="Экспортировать данные" class="footer__button" @click="exportData"></BasicButton>
      </div>
    </div>
    <NotificationMessages />
    <ModalWindow @close="isOpenImportWindow=false" :closed-click-outside="true" :is-visible="isOpenImportWindow" class="modal-import" title="Необходимо выбрать сразу 3 файла" subtitle="Названия выбранных файлов: images.chunks.bson, images.files.bson, exercises.bson" >
      <template #buttons>
        <div class="modal-import__buttons">
          <BasicButton label="Выбрать" class="modal-button" @click="importData" />
          <BasicButton label="Отмена" theme="purple" class="modal-button" @click="isOpenImportWindow=false" />
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<style scoped lang="scss">
.page-wrapper{
  flex-direction: column;
  display: flex;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color:$light-brand;
  &.reviewPage{
    background-color: #a49fb3;
  }
  .modal-import{
    &__buttons{
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 100px;
      .modal-button{
        width:200px;
      }
    }
  }
  @include thin-scrollbar;
  & .container{
    width: 100%;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    max-width: 1600px;
    & .header{
      max-width: 1600px;
      z-index: 5;
      position: fixed;
      top: 0;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      display: flex;
      padding: 20px 150px;
      background-color: $brand;
      border-radius: 0 0 90px 90px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      & .links{
        display: flex;
        &__link{
          color: $light-brand;
          font-size: 1.25rem;
          font-weight: 400;
          transition: all 0.2s ease;
          &:hover{
            color: $purple;
          }
        }
      }
      & .logo{
        transition: all 0.2s ease;
        color: $light-brand;
        &:hover{
          color: $purple
        }
      }
    }
    & .page{
      flex-grow: 1;
      width: 100%;
      margin-top: 120px;
    }
    & .footer{
      width: 100%;
      bottom: 0;
      max-width: 1600px;
      padding: 2rem 9rem;
      justify-content: space-between;
      display: flex;
      border-radius: 90px 90px 0 0;
      background-color: $brand;
      margin-top: 0.25rem;
      &__button{
        font-size:1rem;
      }
    }
  }
}
</style>
