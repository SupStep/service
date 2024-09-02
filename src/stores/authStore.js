import axios from 'axios'
import { defineStore } from 'pinia'
const apiClient = axios.create({
	baseURL: 'http://localhost:5001/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

export const useAuthStore = defineStore('auth', {
	state: () => ({
		token: localStorage.getItem('userToken') || null,
		userRole: localStorage.getItem('userRole') || null,
	}),

	actions: {
		setToken(token) {
			this.token = token
			localStorage.setItem('userToken', token)
		},

		setRole(role) {
			this.userRole = role
			localStorage.setItem('userRole', role)
		},

		clearToken() {
			this.token = null
			localStorage.removeItem('userToken')
		},

		async registerUser(payload) {
			try {
				if (
					!payload.fullName ||
					!payload.phoneNumber ||
					!payload.email ||
					!payload.inn ||
					!payload.ogrn ||
					!payload.companyName ||
					!payload.login ||
					!payload.password
				) {
					return { success: false, error: 'All fields are required' }
				}
				const response = await apiClient.post('/register', payload)
				if (response.status === 201) {
					// Примерный статус успешного ответа
					return { success: true }
				} else {
					// Обработка других статусов ошибок
					return { success: false, error: 'Registration failed' }
				}

				return { success: true }
			} catch (error) {
				console.error('Error registering user:', error)
				return { success: false, error: 'Registration failed' }
			}
		},

		async loginUser(payload) {
			try {
				const response = await apiClient.post('/login', payload)
				// Обработать успешный ответ и сохранить токен и роль пользователя
				const { accessToken, role } = response.data
				this.setToken(accessToken)
				this.setRole(role)
				return { success: true }
			} catch (error) {
				console.error('Error logging in user:', error)
				return { success: false, error: 'Login failed' }
			}
		},

		async logoutUser() {
			try {
				this.clearToken()
				this.userRole = null // Очищаем роль пользователя в состоянии хранилища
				localStorage.removeItem('userRole') // Удаляем роль пользователя из локального хранилища
				return { success: true }
			} catch (error) {
				console.error('Error logging out user:', error)
				return { success: false, error: 'Logout failed' }
			}
		},

		async getUserInfo(token) {
			try {
				const response = await apiClient.get('/user-info', {
					headers: {
						Authorization: `${token}`, // Добавляем токен в заголовок Authorization
					},
				})

				if (response.status === 200) {
					// Успешный ответ сервера
					const { user } = response.data
					// Можете сохранить данные пользователя или выполнить другие действия
					return { success: true, user }
				} else {
					// Обработка других статусов ответа сервера
					return { success: false, error: 'Failed to fetch user information' }
				}
			} catch (error) {
				console.error('Error fetching user information:', error)
				return { success: false, error: 'Failed to fetch user information' }
			}
		},

		async getUserCarsAndSections(token) {
			try {
				const response = await apiClient.get('/userCarInSection', {
					headers: {
						Authorization: `${token}`,
					},
				})

				if (response.status === 200) {
					// Успешный ответ сервера
					const { carsAndSections, sections, carsWithoutSections } =
						response.data
					// Можете сохранить данные или выполнить другие действия
					return {
						success: true,
						carsAndSections,
						sections,
						carsWithoutSections,
					}
				} else {
					// Обработка других статусов ответа сервера
					return {
						success: false,
						error: 'Failed to fetch user cars and sections',
					}
				}
			} catch (error) {
				console.error('Error fetching user cars and sections:', error)
				return {
					success: false,
					error: 'Failed to fetch user cars and sections',
				}
			}
		},

		async addCar(payload) {
			try {
				const token = localStorage.getItem('userToken')
				const response = await apiClient.post('/add-car', payload, {
					headers: {
						Authorization: `${token}`,
					},
				})
				if (response.status === 201) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to add car' }
				}
			} catch (error) {
				console.error('Error adding car:', error)
				return { success: false, error: 'Failed to add car' }
			}
		},

		async addSection(payload) {
			try {
				const token = localStorage.getItem('userToken')
				const response = await apiClient.post('/add-section', payload, {
					headers: {
						Authorization: `${token}`,
					},
				})
				if (response.status === 201) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to add section' }
				}
			} catch (error) {
				console.error('Error adding section:', error)
				return { success: false, error: 'Failed to add section' }
			}
		},

		async getCarsAndSections() {
			try {
				const token = localStorage.getItem('userToken')
				const response = await apiClient.get('/CarsAndSections', {
					headers: {
						Authorization: `${token}`,
					},
				})

				if (response.status === 200) {
					// Успешный ответ сервера
					const { userCars, userSections, services, requestDates } =
						response.data
					// Можете сохранить данные или выполнить другие действия

					return {
						success: true,
						userCars,
						userSections,
						services,
						requestDates,
					}
				} else {
					// Обработка других статусов ответа сервера
					return {
						success: false,
						error: 'Failed to get user cars and sections',
					}
				}
			} catch (error) {
				console.error('Error fetching user cars and sections:', error)
				return {
					success: false,
					error: 'Failed to fetch user cars and sections',
				}
			}
		},

		async updateCarSection(payload) {
			try {
				const response = await apiClient.put('/update-car-section', payload)
				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to update car section' }
				}
			} catch (error) {
				console.error('Error updating car section:', error)
				return { success: false, error: 'Failed to update car section' }
			}
		},

		async deleteCar(carId) {
			try {
				const response = await apiClient.delete('/delete-car', {
					data: {
						carId: carId,
					},
				})

				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to delete car' }
				}
			} catch (error) {
				console.error('Error deleting car:', error)
				return { success: false, error: 'Failed to delete car' }
			}
		},

		async deleteNew(id_news) {
			try {
				const response = await apiClient.delete('/delete-new', {
					data: {
						id_news: id_news,
					},
				})

				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to delete new' }
				}
			} catch (error) {
				console.error('Error deleting car:', error)
				return { success: false, error: 'Failed to delete new' }
			}
		},

		async updateCarInfo(carInfo) {
			try {
				const response = await apiClient.put('/update-car-info', { carInfo })
				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to update car information' }
				}
			} catch (error) {
				console.error('Error updating car information:', error)
				return { success: false, error: 'Failed to update car information' }
			}
		},

		async createRequest(requestInfo) {
			try {
				const token = localStorage.getItem('userToken')
				const response = await apiClient.post(
					'/createRequest',
					{ requestInfo },
					{
						headers: {
							Authorization: `${token}`,
						},
					}
				)
				if (response.status === 200) {
					return { success: true }
				} else {
					return {
						success: false,
						error: 'Failed to create request information',
					}
				}
			} catch (error) {
				console.error('Error creating request:', error)
				return { success: false, error: 'Failed to create request information' }
			}
		},

		async getUserRequestInfo() {
			try {
				const token = localStorage.getItem('userToken')
				const response = await apiClient.get('/userRequestInfo', {
					headers: {
						Authorization: `${token}`,
					},
				})

				if (response.status === 200) {
					return {
						success: true,
						requests: response.data,
						services: response.data,
					}
				} else {
					return { success: false, error: 'Failed to fetch requests' }
				}
			} catch (error) {
				console.error('Error getting user request information:', error)
				return {
					success: false,
					error: 'Failed to get request information',
				}
			}
		},

		async getConfirmedUser() {
			try {
				const response = await apiClient.get('/confirmed-users')

				if (response.status === 200) {
					return { success: true, users: response.data }
				} else {
					return { success: false, error: 'Failed to get confirmed users' }
				}
			} catch (error) {
				console.error('Error getting confirmed users:', error)
				return { success: false, error: 'Failed to get confirmed users' }
			}
		},

		async deleteUser(userId) {
			try {
				const response = await apiClient.delete('/delete-user', {
					data: {
						userId: userId,
					},
				})

				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to delete user' }
				}
			} catch (error) {
				console.error('Error deleting car:', error)
				return { success: false, error: 'Failed to delete user' }
			}
		},

		async getUnConfirmedUser() {
			try {
				const response = await apiClient.get('/unconfirmed-users')

				if (response.status === 200) {
					return { success: true, users: response.data }
				} else {
					return { success: false, error: 'Failed to get unconfirmed users' }
				}
			} catch (error) {
				console.error('Error getting confirmed users:', error)
				return { success: false, error: 'Failed to get confirmed users' }
			}
		},

		async confirmUser(userId) {
			try {
				const response = await apiClient.put('/confirm', {
					userId: userId,
				})

				if (response.status === 200) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to confirm user' }
				}
			} catch (error) {
				console.error('Error deleting car:', error)
				return { success: false, error: 'Failed to confirm user' }
			}
		},

		async getUserRequestsInProcess() {
			try {
				const response = await apiClient.get('/UserALlRequest')

				if (response.status === 200) {
					return { success: true, userRequestInfo: response.data }
				} else {
					return {
						success: false,
						error: 'Failed to get user requests in process',
					}
				}
			} catch (error) {
				console.error('Error getting user requests in process:', error)
				return {
					success: false,
					error: 'Failed to get user requests in process',
				}
			}
		},

		async getUserRequestsInProcessFio(fio) {
			try {
				console.log(fio)
				const response = await apiClient.post('/UserRequestFind', { fio })

				if (response.status === 200) {
					return { success: true, find: response.data }
				} else {
					return {
						success: false,
						error: 'Failed to get user requests in process',
					}
				}
			} catch (error) {
				console.error('Error getting user requests in process:', error)
				return {
					success: false,
					error: 'Failed to get user requests in process',
				}
			}
		},

		async absFio(fio) {
			try {
				console.log(fio)
				const response = await apiClient.post('/abs-requests-fio', { fio })

				if (response.status === 200) {
					return { success: true, find: response.data }
				} else {
					return {
						success: false,
						error: 'Failed to get user requests in process',
					}
				}
			} catch (error) {
				console.error('Error getting user requests in process:', error)
				return {
					success: false,
					error: 'Failed to get user requests in process',
				}
			}
		},

		async getAllRequestsFIO(fio) {
			try {
				const response = await apiClient.post('/requestsFIO', { fio })

				if (response.status === 200) {
					return { success: true, find: response.data }
				} else {
					return {
						success: false,
						error: 'Failed to get user requests in process',
					}
				}
			} catch (error) {
				console.error('Error getting user requests in process:', error)
				return {
					success: false,
					error: 'Failed to get user requests in process',
				}
			}
		},

		async confirmRequest(requestId) {
			try {
				const response = await apiClient.put('/confirm-request', {
					requestId: requestId,
				})

				if (response.status === 200) {
					return { success: true, message: 'Request has been confirmed.' }
				} else {
					return { success: false, error: 'Failed to confirm request' }
				}
			} catch (error) {
				console.error('Error confirming request:', error)
				return { success: false, error: 'Failed to confirm request' }
			}
		},

		async startRequest(requestId) {
			try {
				const response = await apiClient.put('/start-request', {
					requestId: requestId,
				})

				if (response.status === 200) {
					return { success: true, message: 'Request has been started.' }
				} else {
					return { success: false, error: 'Failed to confirm started' }
				}
			} catch (error) {
				console.error('Error confirming request:', error)
				return { success: false, error: 'Failed to confirm request' }
			}
		},

		async endRequest(requestId) {
			try {
				const response = await apiClient.put('/end-request', {
					requestId: requestId,
				})

				if (response.status === 200) {
					return { success: true, message: 'Request has been started.' }
				} else {
					return { success: false, error: 'Failed to confirm started' }
				}
			} catch (error) {
				console.error('Error confirming request:', error)
				return { success: false, error: 'Failed to confirm request' }
			}
		},

		async rejectRequest(rejectRequestInfo) {
			try {
				const response = await apiClient.put(
					'/reject-request',
					rejectRequestInfo
				)

				if (response.status === 200) {
					return { success: true, message: 'Request has been rejected.' }
				} else {
					return { success: false, error: 'Failed to reject request' }
				}
			} catch (error) {
				console.error('Error rejecting request:', error)
				return { success: false, error: 'Failed to reject request' }
			}
		},

		async getAllRequests() {
			try {
				const response = await apiClient.get('/requests')

				if (response.status === 200) {
					return {
						success: true,
						requests: response.data,
						services: response.data,
					}
				} else {
					return { success: false, error: 'Failed to fetch requests' }
				}
			} catch (error) {
				console.error('Error fetching requests:', error)
				return { success: false, error: 'Failed to fetch requests' }
			}
		},

		async getAllRequestsTable() {
			try {
				const response = await apiClient.get('/requestsTable')

				if (response.status === 200) {
					return {
						success: true,
						requests: response.data,
						services: response.data,
					}
				} else {
					return { success: false, error: 'Failed to fetch requests' }
				}
			} catch (error) {
				console.error('Error fetching requests:', error)
				return { success: false, error: 'Failed to fetch requests' }
			}
		},

		async getAbsAllRequests() {
			try {
				const response = await apiClient.get('/abs-requests')

				if (response.status === 200) {
					return {
						success: true,
						requests: response.data,
						services: response.data,
					}
				} else {
					return { success: false, error: 'Failed to fetch requests' }
				}
			} catch (error) {
				console.error('Error fetching requests:', error)
				return { success: false, error: 'Failed to fetch requests' }
			}
		},

		async getNews() {
			try {
				const response = await apiClient.get('/news')
				if (response.status === 200) {
					return { success: true, news: response.data }
				} else {
					return { success: false, error: 'Failed to fetch requests' }
				}
			} catch (error) {
				console.error('Error fetching requests:', error)
				return { success: false, error: 'Failed to fetch requests' }
			}
		},

		async createNews(name, text) {
			try {
				const response = await apiClient.post('/create-post', { name, text })
				if (response.status === 201) {
					return { success: true }
				} else {
					return { success: false, error: 'Failed to create news' }
				}
			} catch (error) {
				console.error('Error creating news:', error)
				return { success: false, error: 'Failed to create news' }
			}
		},

		async searchUserByFIO(fio) {
			try {
				// Выполняем POST-запрос на сервер, передавая ФИО
				const response = await apiClient.post('/find-user-fio', {
					fio,
				})

				return response.data
			} catch (error) {
				// Если произошла ошибка, возвращаем ошибку
				return { success: false, error: 'Ошибка при выполнении запроса' }
			}
		},

		async searchUncUserByFIO(fio) {
			try {
				// Выполняем POST-запрос на сервер, передавая ФИО
				const response = await apiClient.post('/find-unc-user-fio', {
					fio,
				})

				return response.data
			} catch (error) {
				// Если произошла ошибка, возвращаем ошибку
				return { success: false, error: 'Ошибка при выполнении запроса' }
			}
		},

		async uploadPhotos(formData) {
			const token = localStorage.getItem('userToken')
			try {
				const response = await apiClient.post(`/uploadPhotos`, formData, {
					headers: {
						Authorization: `${token}`,
						'Content-Type': 'multipart/form-data',
					},
				})

				if (response.data.success) {
					// Обработка успешной загрузки фотографий
					return true
				} else {
					// Обработка ошибки при загрузке фотографий
					console.error('Ошибка при загрузке фотографий:', response.data.error)
					throw response.data.error
				}
			} catch (error) {
				// Обработка ошибок, возникающих при выполнении запроса
				console.error('Ошибка при отправке данных на сервер:', error)
				throw error
			}
		},
	},
})
