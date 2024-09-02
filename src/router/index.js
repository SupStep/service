import { createRouter, createWebHistory } from 'vue-router'
import AllRequestsTableView from '../views/AllRequestsTableView.vue'
import CarView from '../views/CarView.vue'
import ContactView from '../views/ContactView.vue'
import HistoryView from '../views/HistoryView.vue'
import HomeView from '../views/HomeView.vue'
import KlientView from '../views/KlientView.vue'
import NewsView from '../views/NewsView.vue'
import ProfileView from '../views/ProfileView.vue'
import RequestActiveView from '../views/RequestActiveView.vue'
import RequestHistoryAdminView from '../views/RequestHistoryAdminView.vue'
import RequestRegView from '../views/RequestRegView.vue'
import RequestView from '../views/RequestView.vue'
import SheduleView from '../views/SheduleView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/Profile',
			name: 'Profile',
			component: ProfileView,
		},
		{
			path: '/Car',
			name: 'Car',
			component: CarView,
		},
		{
			path: '/Request',
			name: 'Request',
			component: RequestView,
		},
		{
			path: '/History',
			name: 'History',
			component: HistoryView,
		},
		{
			path: '/Contact',
			name: 'Contact',
			component: ContactView,
		},
		{
			path: '/Shedule',
			name: 'Shedule',
			component: SheduleView,
		},
		{
			path: '/Klient',
			name: 'Klient',
			component: KlientView,
		},
		{
			path: '/RequestReg',
			name: 'RequestReg',
			component: RequestRegView,
		},

		{
			path: '/RequestActive',
			name: 'RequestActive',
			component: RequestActiveView,
		},
		{
			path: '/RequestHistory',
			name: 'RequestHistory',
			component: RequestHistoryAdminView,
		},
		{
			path: '/news',
			name: 'news',
			component: NewsView,
		},
		{
			path: '/AllRequestsTable',
			name: 'AllRequestsTable',
			component: AllRequestsTableView,
		},
	],
})

export default router
