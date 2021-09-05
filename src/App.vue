<template>
	<div class="bg">
		<div class="app">
			<img alt="Vue logo" :src="require('./assets/images/logo.png')"/>
			<h1>{{ msg }}</h1>
		</div>
	</div>
</template>

<script>
export default {
	name: "App",
	data() {
		return {
			msg: "Hello Vue 2"
		}
	}
}
</script>

<style scoped>
.app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	padding-top: 60px;
	font-size: 30px;
}

.bg {
	height: calc(100vh - 0px);
	background-image: url("./assets/images/shanzi.jpg");
}
</style>