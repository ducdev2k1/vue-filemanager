// import { IFileManager } from '@/interfaces/IFileManager';
// import { defineStore } from 'pinia';

// export const BreadcrumbsStore = defineStore('BreadcrumbsStore', () => {
//   const breadcumbs = ref([] as IFileManager[]);

//   function actionSetBreadcumbs(item: IFileManager[]) {
//     breadcumbs.value = item;
//   }

//   function actionAppendBreadcumbs(item: IFileManager) {
//     const findExisted = breadcumbs.value.some((value) => value.path === item.path);
//     if (findExisted) return;
//     breadcumbs.value.push({
//       path: item.path,
//       name: item.name,
//     } as IFileManager);
//   }

//   function actionPopBreadcumbs() {
//     breadcumbs.value.pop();
//   }

//   function actionSelectByBreadcumbs(item: IFileManager) {
//     const findIndex = breadcumbs.value.findIndex((value) => value.path === item.path);
//     if (findIndex < 0) return;
//     breadcumbs.value.splice(findIndex + 1, breadcumbs.value.length - 1);
//   }

//   function actionClearBreadcumbs() {
//     breadcumbs.value = [];
//   }

//   return {
//     breadcumbs,
//     actionAppendBreadcumbs,
//     actionSetBreadcumbs,
//     actionPopBreadcumbs,
//     actionSelectByBreadcumbs,
//     actionClearBreadcumbs,
//   };
// });
