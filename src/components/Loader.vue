<template>
  <div class="loader">
    <i class="fas fa-spinner"></i>
  </div>
</template>

<script>
export default {
name: "loader"
}
</script>

<style lang="scss" scoped>
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  background: white url('../assets/LoginBackground.svg') no-repeat center;
  background-size: 90%;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;

  i {
    animation: rotating 2s linear infinite;
  }
}
</style>