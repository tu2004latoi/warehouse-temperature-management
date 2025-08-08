import {useReducer} from "./useReducer";
import {authApis} from "../configs/Apis";

// Reducer xử lý các trạng thái POST
function postReducer(state, action) {
	switch (action.type) {
		case "postAPI/request":
			return {...state, isLoading: true, error: null};
		case "postAPI/success":
			return {...state, isLoading: false, data: action.data, error: null};
		case "postAPI/error":
			return {...state, isLoading: false, data: null, error: action.error};
		default:
			return state;
	}
}

export const usePost = (url) => {
	const [state, dispatch] = useReducer(postReducer, {
		data: null,
		isLoading: false,
		error: null,
	});

	const postData = async (body) => {
		dispatch({type: "postAPI/request"});

		try {
			const API = await authApis();

			const isFormData = body instanceof FormData;

			const config = isFormData
				? {} // Để axios tự set content-type cho FormData
				: {headers: {"Content-Type": "application/json"}};

			const res = await API.post(url, body, config);
			dispatch({type: "postAPI/success", data: res.data});
			return res.data;
		} catch (err) {
			dispatch({type: "postAPI/error", error: err});
			console.error("postData error:", err);
		}
	};

	return {
		...state,
		postData,
	};
};

