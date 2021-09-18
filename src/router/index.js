import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
/**
 * 反正有很多路由就行了,你别管
 */
const router = new VueRouter({
	routes: [
		{
			path: "/",
			name: "Root",
			redirect: "/home",
		},
		{
			name: "Home",
			path: "/home",
			component: () => import("../pages/Home.vue"),
			meta: {title: "响应式页面"},
		}
	]
})

router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	next();
});

export default router;