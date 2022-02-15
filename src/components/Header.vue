<template>
  <div class="header">
    <img class="arrow-back" src="/arrow-back.png" alt="back" @click="$emit('goBack')" />
    <span>{{ title }}</span>
  </div>
  <div class="bg"></div>
</template>

<script>
export default {
  name: 'Header',
  props: ['title'],
  emits: ['goBack']
};
</script>

<style scoped>
.header {
  width: 1080px;
  box-sizing: border-box;
  padding: 50px 40px 50px;

  position: fixed;
  top: 0;
  z-index: 1;
  background-color: #eeeeee;

  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 48px;
  color: #5277bf;
}
.header span {
  cursor: pointer;
}
.arrow-back {
  float: left;
  cursor: pointer;
}
.bg {
  width: 1080px;
  height: 158px;
}
</style>
