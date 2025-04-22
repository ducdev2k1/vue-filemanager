// Import tất cả các component trong thư mục hiện tại
const components = import.meta.glob('./*.vue', { eager: true });

// Định nghĩa kiểu dữ liệu cho các component được export
type ComponentExports = {
  [key: string]: any; // Sử dụng `any` nếu các component chưa được định kiểu cụ thể
};

// Xuất các component dưới dạng named exports
const exportedComponents: ComponentExports = Object.keys(components).reduce((acc, path) => {
  // Lấy tên component từ tên file (ví dụ: `IAutocomplete.vue` thành `IAutocomplete`)
  const componentName = path.match(/\.\/(.*)\.vue$/)?.[1];
  if (componentName) {
    acc[componentName] = (components[path] as { default: any }).default;
  }
  return acc;
}, {} as ComponentExports);

export default exportedComponents;
