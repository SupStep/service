<template>
	<n-config-provider>
		<n-message-provider>
			<n-modal-provider>
				<RegistrationForm v-if="!isLoggedIn" />
				<header>
					<RouterLink class="logo" to="/">UService</RouterLink>
					<n-button @click="logout" quaternary v-if="isLoggedIn"
						>Выход</n-button
					>
				</header>
				<div class="page-container">
					<div class="wrapper">
						<nav class="menu-list">
							<RouterLink
								v-if="userRole === 'пользователь'"
								class="menu-item"
								:class="{ active: $route.path === '/Profile' }"
								to="/Profile"
								>Мой профиль</RouterLink
							>
							<RouterLink
								v-if="userRole === 'пользователь'"
								class="menu-item"
								:class="{ active: $route.path === '/Car' }"
								to="/Car"
								>Мои авто</RouterLink
							>
							<RouterLink
								v-if="userRole === 'пользователь'"
								class="menu-item"
								:class="{ active: $route.path === '/Request' }"
								to="/Request"
								>Оформить заявку</RouterLink
							>
							<RouterLink
								v-if="userRole === 'пользователь'"
								class="menu-item"
								:class="{ active: $route.path === '/History' }"
								to="/History"
								>История заявок</RouterLink
							>
							<RouterLink
								v-if="userRole === 'пользователь'"
								class="menu-item"
								:class="{ active: $route.path === '/Contact' }"
								to="/Contact"
								>Контакты</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/Klient' }"
								to="/Klient"
								>Клиенты</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/RequestReg' }"
								to="/RequestReg"
								>Заявки на регистрацию</RouterLink
							>

							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/Shedule' }"
								to="/Shedule"
								>Расписание</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/RequestActive' }"
								to="/RequestActive"
								>Активные заявки</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/RequestHistory' }"
								to="/RequestHistory"
								>История заявок</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/AllRequestsTable' }"
								to="/AllRequestsTable"
								>Все заявки</RouterLink
							>
							<RouterLink
								v-if="userRole === 'администратор'"
								class="menu-item"
								:class="{ active: $route.path === '/news' }"
								to="/news"
								>Новости/Реклама</RouterLink
							>
						</nav>
					</div>
					<div class="content">
						<RouterView />
					</div>
				</div>
			</n-modal-provider>
		</n-message-provider>
	</n-config-provider>
</template>

<script setup>
import { NConfigProvider } from 'naive-ui'
import { computed } from 'vue'
import RegistrationForm from './components/RegistrationForm.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

// Получаем роль пользователя из хранилища
const userRole = computed(() => authStore.userRole)

// Проверяем, авторизован ли пользователь
const isLoggedIn = computed(() => !!authStore.token)

const logout = () => {
	router.push('/')
	const res = authStore.logoutUser()
	if (res.status === true) {
		location.reload()
	}
}
</script>

<style scoped>
header {
	padding: 0px 40px;
	border-bottom: 2px solid #ccc;
	background-color: #dddddd;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.logo {
	text-decoration: none;
	color: #fff;
	padding: 12px 0;
	font-weight: bold;
	font-size: 18px;
}

.page-container {
	display: flex;
}

.wrapper {
	float: left;
	border-right: 2px solid #ccc;
	min-width: 15em;
	height: calc(100vh - 55px);
}

.content {
	width: 100%;
	padding: 20px;
}

.menu-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 20px 10px;
}

.menu-item {
	text-align: center;
	font-size: 16px;
	text-decoration: none;
	color: black;
	padding: 12px 0;
	border-radius: 5px;
	transition: 0.2s;
}

.menu-item:hover {
	background-color: #f9f9f9;
	color: #18a058ff;
}

.active {
	background-color: #f9f9f9;
	color: #18a058ff;
}
</style>
