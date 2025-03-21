<template>
  <div class="index-page">
    <h1>Добро пожаловать</h1>
    <ClientOnly>
      <LoginForm />
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.index-page {
  padding: 2rem;
  text-align: center;

  h1 {
    margin-bottom: 2rem;
  }
}
</style>