<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <router-link to="/HelloWorld">HelloWorld</router-link>
    <router-link to = "/components/copyright/copyright">copyright</router-link>
  </div>
</template>

<script>

export default {
  name: 'mainPage',
  data () {
    return {
      msg: '这里是入口'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
