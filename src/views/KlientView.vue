<template>
	<div class="request-wrapper">
		<header>
			<h1 class="content-title">Клиенты:</h1>
			<div style="display: flex">
				<n-input
					type="text"
					placeholder="Поиск"
					v-model:value="searchFio"
					@keyup.enter="searchUsers"
					style="margin-right: 20px"
				/>

				<n-button type="error" @click="deleteSelectedUsers"
					>Удалить пользователя</n-button
				>
			</div>
		</header>
		<div
			style="
				padding-bottom: 20px;
				border-bottom: 1px solid black;
				margin-bottom: 20px;
			"
			v-if="isFind"
		>
			<h1 class="content-title" style="margin-bottom: 20px">
				Результат поиска
			</h1>
			<div
				v-for="user in searchedKlient"
				:key="user.id_klient"
				class="user-item"
				@click="showKlient(user)"
			>
				<p>ID{{ user.id_klient }}</p>
				<p>{{ user.fio }}</p>
			</div>
			<p v-if="!searchedKlient.length">Пользователь не найден</p>
		</div>
		<div>
			<ul style="list-style-type: none" class="user-list">
				<li
					v-for="user in confirmedUsers.users"
					:key="user.id_klient"
					class="user-item"
					@click="showKlient(user)"
				>
					<input
						type="checkbox"
						class="user-checkbox"
						@change="toggleSelectUser(user.id_klient)"
						:checked="isSelectedUser(user.id_klient)"
						@click.stop
					/>
					<p>ID{{ user.id_klient }}</p>
					<p>{{ user.fio }}</p>
				</li>
			</ul>
		</div>
	</div>

	<n-modal
		v-model:show="modalShowKlient"
		preset="card"
		title="Клиент"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<p>ФИО: {{ selectedUser.fio }}</p>
			<p>Логин: {{ selectedUser.login }}</p>
			<p>Телефон: {{ selectedUser.telephone }}</p>
			<p>Почта: {{ selectedUser.email }}</p>
			<p>ИНН: {{ selectedUser.inn }}</p>
			<p>ОГРН: {{ selectedUser.ogrn }}</p>
			<p>Название компании: {{ selectedUser.company_name }}</p>
		</form>
	</n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const modalShowKlient = ref(false)
const authStore = useAuthStore()
const confirmedUsers = ref([])

const bodyStyle = {
	width: '400px',
}

const searchFio = ref('')
const searchedKlient = ref([])
const isFind = ref(false)

const selectedUser = ref([])

const selectedUsers = ref([])

const showKlient = user => {
	selectedUser.value = user
	modalShowKlient.value = true
}

const toggleSelectUser = userId => {
	const index = selectedUsers.value.indexOf(userId)
	if (index === -1) {
		selectedUsers.value.push(userId)
	} else {
		selectedUsers.value.splice(index, 1)
	}
}

const isSelectedUser = userId => {
	return selectedUsers.value.includes(userId)
}

const searchUsers = async () => {
	try {
		isFind.value = true
		const response = await authStore.searchUserByFIO(searchFio.value)
		if (response.success) {
			searchedKlient.value = response.users
			console.log(searchedKlient.value)
		} else {
			console.error('Failed to get confirmed users:', response.error)
		}
	} catch (error) {
		console.error('Error getting confirmed users:', error)
	}
}

const deleteSelectedUsers = async () => {
	try {
		for (const userId of selectedUsers.value) {
			const response = await authStore.deleteUser(userId)
			if (response.success) {
				location.reload()
			} else {
				// Ошибка при удалении автомобиля
				console.error('Failed to delete user:', response.error)
			}
		}
		// Очищаем список выбранных автомобилей после удаления
		selectedUsers.value = []
	} catch (error) {
		console.error('Error deleting user:', error)
	}
}

onMounted(async () => {
	try {
		const response = await authStore.getConfirmedUser()
		if (response.success) {
			confirmedUsers.value = response.users
			console.log(confirmedUsers.value)
		} else {
			console.error('Failed to get confirmed users:', response.error)
		}
	} catch (error) {
		console.error('Error getting confirmed users:', error)
	}
})
</script>

<style scoped>
header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
}
.content-title {
	font-size: 16px;
	font-weight: normal;
}

.user-list {
	display: flex;
	justify-content: center;
	gap: 40px;
	flex-wrap: wrap;
}

.user-item {
	position: relative;
	padding: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 10px;
	border: 1px solid black;
	width: 20%;
}

.user-checkbox {
	position: absolute;
	top: -8px;
	right: -8px;
	cursor: pointer;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: #efefef;
	border: 1px solid #ff0000;
	appearance: none;

	cursor: pointer;
}

.user-checkbox:checked {
	background-color: rgb(255, 0, 0);
}
</style>
