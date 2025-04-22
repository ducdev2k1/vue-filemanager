# Vue FileManager

---

## English

### Overview

`@ducdev2k1/vue-filemanager` is a customizable file manager component for Vue 3. It provides an intuitive interface for browsing files and directories, with support for breadcrumbs, context menus, toolbar actions, and dark/light themes.

### Features

- File and folder navigation with breadcrumb support
- Customizable toolbar and context menu actions
- Dark and light theme support
- Responsive design with fixed header and scroll handling
- TypeScript support for type-safe development
- Configurable row height and thumbnail icons

### Installation

Install the package and its dependencies via npm:

```bash
npm install @ducdev2k1/vue-filemanager
```

Ensure you have Vue 3 and Vuetify 3 configured in your project.

### Setup

1. **Import FileManager**: Use the `FileManager` component in your Vue component.

### Usage

Here’s a basic example using `<script setup>` with TypeScript:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { FileManager } from '@ducdev2k1/vue-filemanager';

  const selectedItems = ref<any[]>([]);
  const loading = ref(false);

  const handleRefresh = () => {
    loading.value = true;
    setTimeout(() => (loading.value = false), 2000);
  };
</script>

<template>
  <div style={height: "100vh"}>
    <FileManager text-bread="File Manager" currentPath="" :loading="loading" @refresh="handleRefresh" />
  </div>
</template>
```

For a complete example with advanced features like breadcrumbs and custom actions, see the Usage Documentation.

### API

#### Props

| Prop                    | Type             | Default   | Description                                    |
| ----------------------- | ---------------- | --------- | ---------------------------------------------- |
| `text-bread`            | `String`         | `''`      | Breadcrumb header text.                        |
| `currentPath`           | `String`         | `''`      | Current directory path.                        |
| `return-object`         | `Boolean`        | `false`   | Returns full object for selected items.        |
| `fixed-header`          | `Boolean`        | `false`   | Fixes header to the top.                       |
| `height`                | `String`         | `'100vh'` | Container height (e.g., `'100vh'`, `'500px'`). |
| `breadcrumb`            | `IFileManager[]` | `[]`      | Array of breadcrumb items.                     |
| `action-toolbar`        | `IActionFM[]`    | `[]`      | Toolbar action items.                          |
| `item-height`           | `Number`         | `46`      | Row height in pixels.                          |
| `loading`               | `Boolean`        | `false`   | Shows loading state.                           |
| `theme`                 | `String`         | `'light'` | Theme (`'light'` or `'dark'`).                 |
| `show-checkbox`         | `Boolean`        | `false`   | Enables checkboxes for multi-selection.        |
| `update-selected`       | `Function`       | \-        | Updates selected items array.                  |
| `update-selected-one`   | `Function`       | \-        | Updates single selected item.                  |
| `custom-thumbnail-icon` | `Function`       | \-        | Customizes thumbnail icons.                    |
| `context-menu-click`    | `Function`       | \-        | Handles context menu clicks.                   |
| `toolbar-click`         | `Function`       | \-        | Handles toolbar action clicks.                 |
| `on-click-row`          | `Function`       | \-        | Handles row single-click.                      |
| `on-click-breadcrumb`   | `Function`       | \-        | Handles breadcrumb clicks.                     |
| `double-click-row`      | `Function`       | \-        | Handles row double-click.                      |

#### Events

| Event     | Payload | Description                  |
| --------- | ------- | ---------------------------- |
| `scroll`  | `Event` | Emitted on container scroll. |
| `refresh` | `None`  | Emitted on refresh action.   |

#### Interfaces

```typescript
interface IFileManager {
  isDirectory: boolean;
  name: string;
  path: string;
  [key: string]: any;
}

interface IActionFM {
  label: string;
  icon: string;
  action: string;
}
```

### Example

A more advanced example with breadcrumbs and custom actions:

```vue
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { FileManager } from '@ducdev2k1/filemanager-vuetify';

  const DemoActionFM = [
    { label: 'Upload', icon: 'mdi-upload', action: 'upload' },
    { label: 'New Folder', icon: 'mdi-folder-plus', action: 'new-folder' },
  ];

  const selectedItems = ref<any[]>([]);
  const selectedOneItem = ref<any>();
  const listBreadcrumb = ref<IFileManager[]>([]);
  const loading = ref(false);

  const handleDoubleClickRow = (item: IFileManager) => {
    if (item.isDirectory) listBreadcrumb.value.push(item);
  };

  watch(selectedItems, (newVal) => console.log('Selected:', newVal));
</script>

<template>
  <FileManager
    text-bread="Demo"
    currentPath=""
    return-object
    fixed-header
    height="100vh"
    :breadcrumb="listBreadcrumb"
    :action-toolbar="DemoActionFM"
    :loading="loading"
    :theme="'dark'"
    :update-selected="(data) => (selectedItems = data)"
    :update-selected-one="(data) => (selectedOneItem = data)"
    :double-click-row="handleDoubleClickRow" />
</template>
```

### Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please include tests and update documentation where applicable.

### Issues

Report bugs or suggest features via the GitHub Issues page.

### License

This project is licensed under the MIT License.

### Acknowledgments

Built with using Vue 3 

---

## Tiếng Việt

### Tổng quan

`@ducdev2k1/filemanager-vuetify` là một thành phần quản lý tệp tùy chỉnh cho Vue 3, được xây dựng dựa trên Vuetify 3. Nó cung cấp giao diện trực quan để duyệt tệp và thư mục, hỗ trợ breadcrumb, menu ngữ cảnh, hành động trên thanh công cụ và giao diện sáng/tối.

### Tính năng

- Điều hướng tệp và thư mục với hỗ trợ breadcrumb
- Tùy chỉnh thanh công cụ và menu ngữ cảnh
- Hỗ trợ giao diện sáng và tối
- Thiết kế đáp ứng với tiêu đề cố định và xử lý cuộn
- Hỗ trợ TypeScript cho phát triển an toàn kiểu
- Tùy chỉnh chiều cao hàng và biểu tượng thu nhỏ

### Cài đặt

Cài đặt gói và các phụ thuộc của nó qua npm:

```bash
npm install @ducdev2k1/vue-filemanager
```

Đảm bảo bạn đã cấu hình Vue 3 và Vuetify 3 trong dự án của mình.

### Thiết lập

1. **Nhập FileManager**: Sử dụng thành phần `FileManager` trong thành phần Vue của bạn.

### Sử dụng

Dưới đây là một ví dụ cơ bản sử dụng `<script setup>` với TypeScript:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { FileManager } from '@ducdev2k1/filemanager-vuetify';

  const selectedItems = ref<any[]>([]);
  const loading = ref(false);

  const handleRefresh = () => {
    loading.value = true;
    setTimeout(() => (loading.value = false), 2000);
  };
</script>

<template>
  <div style={height: "100vh"}>
    <FileManager text-bread="Quản lý Tệp" currentPath="" :loading="loading" @refresh="handleRefresh" />
  </div>
</template>
```

Để xem ví dụ đầy đủ với các tính năng nâng cao như breadcrumb và hành động tùy chỉnh, hãy tham khảo Tài liệu Sử dụng.

### API

#### Thuộc tính (Props)

| Thuộc tính              | Kiểu dữ liệu     | Mặc định  | Mô tả                                              |
| ----------------------- | ---------------- | --------- | -------------------------------------------------- |
| `text-bread`            | `String`         | `''`      | Văn bản hiển thị trên tiêu đề breadcrumb.          |
| `currentPath`           | `String`         | `''`      | Đường dẫn thư mục hiện tại.                        |
| `return-object`         | `Boolean`        | `false`   | Trả về đối tượng đầy đủ cho các mục đã chọn.       |
| `fixed-header`          | `Boolean`        | `false`   | Cố định tiêu đề ở phía trên.                       |
| `height`                | `String`         | `'100vh'` | Chiều cao vùng chứa (ví dụ: `'100vh'`, `'500px'`). |
| `breadcrumb`            | `IFileManager[]` | `[]`      | Mảng các mục breadcrumb.                           |
| `action-toolbar`        | `IActionFM[]`    | `[]`      | Mảng các hành động trên thanh công cụ.             |
| `item-height`           | `Number`         | `46`      | Chiều cao của mỗi hàng (tính bằng pixel).          |
| `loading`               | `Boolean`        | `false`   | Hiển thị trạng thái đang tải.                      |
| `theme`                 | `String`         | `'light'` | Giao diện (`'light'` hoặc `'dark'`).               |
| `show-checkbox`         | `Boolean`        | `false`   | Hiển thị hộp kiểm cho chọn nhiều mục.              |
| `update-selected`       | `Function`       | \-        | Cập nhật mảng các mục đã chọn.                     |
| `update-selected-one`   | `Function`       | \-        | Cập nhật một mục được chọn.                        |
| `custom-thumbnail-icon` | `Function`       | \-        | Tùy chỉnh biểu tượng thu nhỏ.                      |
| `context-menu-click`    | `Function`       | \-        | Xử lý nhấp vào menu ngữ cảnh.                      |
| `toolbar-click`         | `Function`       | \-        | Xử lý nhấp vào hành động trên thanh công cụ.       |
| `on-click-row`          | `Function`       | \-        | Xử lý nhấp đơn vào hàng.                           |
| `on-click-breadcrumb`   | `Function`       | \-        | Xử lý nhấp vào breadcrumb.                         |
| `double-click-row`      | `Function`       | \-        | Xử lý nhấp đúp vào hàng.                           |

#### Sự kiện (Events)

| Sự kiện   | Dữ liệu trả về | Mô tả                            |
| --------- | -------------- | -------------------------------- |
| `scroll`  | `Event`        | Phát ra khi vùng chứa được cuộn. |
| `refresh` | `None`         | Phát ra khi thực hiện làm mới.   |

#### Giao diện (Interfaces)

```typescript
interface IFileManager {
  isDirectory: boolean;
  name: string;
  path: string;
  [key: string]: any;
}

interface IActionFM {
  label: string;
  icon: string;
  action: string;
}
```

### Ví dụ

Ví dụ nâng cao với breadcrumb và hành động tùy chỉnh:

```vue
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { FileManager } from '@ducdev2k1/vue-filemanager';

  const DemoActionFM = [
    { label: 'Tải lên', icon: 'mdi-upload', action: 'upload' },
    { label: 'Thư mục mới', icon: 'mdi-folder-plus', action: 'new-folder' },
  ];

  const selectedItems = ref<any[]>([]);
  const selectedOneItem = ref<any>();
  const listBreadcrumb = ref<IFileManager[]>([]);
  const loading = ref(false);

  const handleDoubleClickRow = (item: IFileManager) => {
    if (item.isDirectory) listBreadcrumb.value.push(item);
  };

  watch(selectedItems, (newVal) => console.log('Đã chọn:', newVal));
</script>

<template>
  <FileManager
    text-bread="Demo"
    currentPath=""
    return-object
    fixed-header
    height="100vh"
    :breadcrumb="listBreadcrumb"
    :action-toolbar="DemoActionFM"
    :loading="loading"
    :theme="'dark'"
    :update-selected="(data) => (selectedItems = data)"
    :update-selected-one="(data) => (selectedOneItem = data)"
    :double-click-row="handleDoubleClickRow" />
</template>
```

### Báo lỗi

Báo cáo lỗi hoặc đề xuất tính năng qua trang Issues trên GitHub.

### Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.

### Lời cảm ơn

Được xây dựng với Vue3
