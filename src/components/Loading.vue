<template>
    <div class="donut"></div>
</template>

<style lang="scss" scoped>
.donut {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  border: 0.3rem solid rgba($primary-color, 0.3);
  border-top-color: $primary-color;
  animation: 1.5s spin infinite linear;

  &.multi {
    border-bottom-color: $primary-color;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>