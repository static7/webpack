import Vue from "vue";
import App from "./App";
import router from "./router/index";
import './assets/css/index.css';

new Vue({
	router: router,
	render:h=>h(App),
}).$mount('#app')
