<script setup lang="ts"></script>

<template>
  <!-- <div class="loading-overlay">
    <SkeletonLoader :type="EnumTypeSkeletonLoader.sentences" width="220" />
  </div> -->
  <div class="loading-overlay" v-bind="$attrs">
    <div
      class="w-[2em] h-[2em] border-4 text-[#f7ac1a] text-4xl animate-spin border-[#53bc88] flex items-center justify-center border-t-[#f7ac1a] rounded-full">
      <svg
        height="1em"
        width="1em"
        viewBox="0 0 31 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="animate-ping">
        <path
          d="M13.2955 12.2819L10.6158 18.0281L8.34365 13.1548L5.3217 6.67255L4.44501 4.79419L0 5.57731L0.876065 7.4563L3.89927 13.9385L8.12448 23H8.29781H12.9337H13.1071L18.5361 11.3581L13.2955 12.2819Z"
          fill="#53BC88" />
        <path
          d="M25.3043 0.853457V0.852829L20.8492 1.63846H24.5689L23.8693 3.13939L20.3054 10.7822L14.6094 23H19.4186L25.5473 9.8584L29.1112 2.2156L30.1443 0L25.3043 0.853457Z"
          fill="#F7AC1A" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
  .loading-overlay {
    @apply absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white rounded-def;
    @apply dark:bg-drive-dark-900;
    .v-skeleton-loader {
      @apply min-w-[20rem] bg-transparent;
      &__bone::after {
        @apply dark:bg-gradient-to-l dark:from-drive-dark-900/30 dark:to-transparent;
      }
      .v-skeleton-loader__text {
        @apply dark:bg-white/20;
      }
    }
  }
</style>
