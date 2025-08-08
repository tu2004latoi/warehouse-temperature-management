import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const BASE_URL = 'http://localhost:8080/api/';

export const endpoints = {
	login: '/auth/login',
	profile: '/secure/profile',
	users: '/users',
	usersDetail: (id) => `/users/${id}`,
	userAdd: '/users/add',
	userUpdate: (id) => `/users/${id}/update`,
	userDelete: (id) => `/users/${id}`,


	products: '/products',
	productAdd: '/products/add',
	productUpdate: (id) => `/products/${id}/update`,
	productDetail: (id) => `/products/${id}`,
	productDelete: (id) => `/products/${id}`,

	categories: '/categories',
	categoryDetail: (id)=> `/categories/${id}`,
	categoryAdd: `/categories/add`,
	categoryDelete:(id) => `/categories/${id}`,

	units: '/units',
	unitDetail:(id)=> `/units/${id}`,
	unitAdd: '/units/add',
	unitDelete:(id)=> `/units/${id}`,
}

export const authApis = async () => {
	const token = await AsyncStorage.getItem('token');
	if (!token) {
		console.error("Token không tồn tại");
		throw new Error("Token không tồn tại");
	}
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})

}

export default axios.create({
	baseURL: BASE_URL
});
