// Import tất cả các component .vue trong thư mục components
const components = import.meta.glob('./**/*.vue', { eager: true });

// Định nghĩa kiểu để lưu cho các component được export
type ComponentExports = {
  [key: string]: any; // Sử dụng 'any' nếu các component chưa định nghĩa kiểu cụ thể
};

// Tạo object chứa các component đã được import
const exportedComponents: ComponentExports = Object.keys(components).reduce((acc, path) => {
  // Lấy tên component từ đường dẫn file (ví dụ: 'Button.vue' -> 'Button')
  const componentName = path.split('/').pop()?.replace('.vue', '') || '';

  // Gán component vào object với key là tên component
  if (componentName) {
    acc[componentName] = (components[path] as { default: any }).default;
  }

  return acc;
}, {} as ComponentExports);

// Export các component
export default exportedComponents;
