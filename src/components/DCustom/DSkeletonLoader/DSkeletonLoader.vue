<script setup lang="ts">
  import { EnumTheme } from '@/utils';

  type SkeletonType = 'text' | 'card' | 'list' | 'avatar' | 'image';

  interface IProps {
    type?: SkeletonType;
    theme?: EnumTheme;
  }

  defineProps<IProps>();

  const SkeletonLoader = defineComponent({
    name: 'SkeletonLoader',
    props: {
      type: {
        type: String as () => SkeletonType,
        default: 'text',
      },
      width: String,
      height: String,
      boilerplate: {
        type: Boolean,
        default: false,
      },
      className: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const baseClass = computed(
        () => `d-skeleton-loader ${props.boilerplate ? 'is-boilerplate' : ''} ${props.className}`,
      );

      const getSkeletonContent = () => {
        switch (props.type) {
          case 'card':
            return h('div', {
              class: `${baseClass.value} d-skeleton-loader--card`,
              style: { width: props.width, height: props.height },
            });
          case 'list':
            return h('div', { class: `${baseClass.value} d-skeleton-loader--list` }, [
              h('div', { class: 'd-skeleton-loader__line d-skeleton-loader__line--large' }),
              h('div', { class: 'd-skeleton-loader__line d-skeleton-loader__line--medium' }),
              h('div', { class: 'd-skeleton-loader__line d-skeleton-loader__line--extra' }),
            ]);
          case 'avatar':
            return h('div', {
              class: `${baseClass.value} d-skeleton-loader--avatar`,
              style: { width: props.width, height: props.height },
            });
          case 'image':
            return h('div', {
              class: `${baseClass.value} d-skeleton-loader--image`,
              style: { width: props.width, height: props.height },
            });
          case 'text':
          default:
            return h('div', {
              class: `${baseClass.value} d-skeleton-loader--text`,
              style: { width: props.width, height: props.height },
            });
        }
      };

      return () => getSkeletonContent();
    },
  });
</script>

<template>
  <div class="d-skeleton-loader">
    <div class="d-skeleton-loader__section">
      <SkeletonLoader
        :type="type"
        :width="type === 'text' ? '200px' : type === 'image' ? '300px' : undefined"
        :height="type === 'image' ? '150px' : undefined"
        :boilerplate="type === 'text' ? true : false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .d-skeleton-loader {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;

    &.is-boilerplate {
      opacity: 0.5;
    }

    &--card {
      width: 100%;
      max-width: 320px;
      height: 256px;
    }

    &--avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    &--image {
      width: 100%;
      height: 192px;
    }

    &--text {
      height: 16px;
      width: 100%;
    }

    &--list {
      width: 100%;

      .d-skeleton-loader__line {
        background: inherit;
        animation: inherit;
        border-radius: 6px;
        margin-bottom: 8px;

        &--large {
          width: 75%;
          height: 16px;
        }

        &--medium {
          width: 50%;
          height: 16px;
        }

        &--extra {
          width: 85%;
          height: 16px;
        }
      }
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Demo layout */
  .d-skeleton-loader {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    &__title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    &__section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &__subtitle {
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
</style>
