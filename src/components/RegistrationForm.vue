<template>
	<div class="layout">
		<div class="container-form">
			<form v-if="!isAccount" class="form-reg">
				<h1 class="form-title">Регистрация</h1>
				<div class="form-wrapper">
					<n-input v-model:value="fullName" type="text" placeholder="ФИО" />
					<n-input
						v-model:value="phoneNumber"
						type="text"
						placeholder="Номер телефона"
					/>
					<n-input v-model:value="email" type="text" placeholder="Почта" />
					<n-input v-model:value="inn" type="text" placeholder="ИНН" />
					<n-input v-model:value="ogrn" type="text" placeholder="ОГРН" />
					<n-input
						v-model:value="companyName"
						type="text"
						placeholder="Название компании"
					/>
					<n-input v-model:value="login" type="text" placeholder="Логин" />
					<n-input v-model:value="password" type="text" placeholder="Пароль" />
				</div>
				<div class="container-button">
					<n-button
						class="button-submit__form"
						type="primary"
						@click="submitRegisterForm"
						>Вход</n-button
					>
				</div>
				<div class="wrapper-toggle">
					<p>Уже есть аккаунт?</p>
					<a @click="toggleAccount">Войти</a>
				</div>
			</form>
			<form v-if="isAccount" class="form-auth">
				<h1 class="form-title">Авторизация</h1>
				<div class="form-wrapper">
					<n-input v-model:value="login" type="text" placeholder="Логин" />
					<n-input
						v-model:value="password"
						type="password"
						placeholder="Пароль"
					/>
				</div>
				<div class="container-button">
					<n-button
						class="button-submit__form"
						type="primary"
						@click="submitLoginForm"
						>Вход</n-button
					>
				</div>
				<div class="wrapper-toggle">
					<p>Еще нет аккаунта?</p>
					<a @click="toggleAccount">Зарегестрироваться</a>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const isAccount = ref(false)
const router = useRouter()
const message = useMessage()

const toggleAccount = () => {
	isAccount.value = !isAccount.value
}

const fullName = ref('')
const phoneNumber = ref('')
const email = ref('')
const inn = ref('')
const ogrn = ref('')
const companyName = ref('')
const login = ref('')
const password = ref('')

const authStore = useAuthStore()

const submitRegisterForm = async () => {
	const result = await authStore.registerUser({
		fullName: fullName.value,
		phoneNumber: phoneNumber.value,
		email: email.value,
		inn: inn.value,
		ogrn: ogrn.value,
		companyName: companyName.value,
		login: login.value,
		password: password.value,
	})
	if (result.success) {
		message.info(
			'Заявка на регистрацию отправлена, ожидайте подтверждение администратора.'
		)
	}
}

const submitLoginForm = async () => {
	const result = await authStore.loginUser({
		login: login.value,
		password: password.value,
	})
	if (result.success) {
	} else {
		message.error('Неверные данные')
	}
}
</script>

<style scoped>
.layout {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #11111179;
	z-index: 9;
}

.container-form {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 30%;
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
	z-index: 10;
}

.form-title {
	text-align: center;
	font-size: 20px;
	margin-bottom: 16px;
}

.form-wrapper {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 16px;
}

.container-button {
	display: flex;
	justify-content: end;
}

.wrapper-toggle {
	display: flex;
	gap: 10px;
}

.wrapper-toggle a {
	cursor: pointer;
	color: #18a058ff;
	text-decoration: underline;
}
</style>
