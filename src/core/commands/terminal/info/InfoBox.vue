<template>
  <div>关于本站：YuIndex 极客范儿的浏览器主页</div>
  <div>
    <a href="https://github.com/limingpu123456/Index-Web" target="_blank">
      代码开源，欢迎 star 和贡献~
    </a>
  </div>
  <div></div>
  <div>
    作者：リメンホ
  </div>
</template>

<script setup lang="ts">
interface InfoBoxProps {
  seconds: string;
}

const props = withDefaults(defineProps<InfoBoxProps>(), {});
</script>

<style scoped></style>
