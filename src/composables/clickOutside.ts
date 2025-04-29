import { Ref, onMounted, onUnmounted } from 'vue';

export function useClickOutside(elementRef: Ref<HTMLElement | null>, callback: () => void) {
  const handler = (event: MouseEvent) => {
    const el = elementRef.value;
    if (el && !el.contains(event.target as Node)) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handler);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });
}
