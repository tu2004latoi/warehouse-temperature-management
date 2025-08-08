export const formatPrice = (price) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND'
	}).format(price);
};

export const formatNumber = (number) => {
	return new Intl.NumberFormat('vi-VN').format(number);
};

export const formatDate = (dateStr) => {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	if (isNaN(d)) return ""; // nếu ngày không hợp lệ
	return d.toISOString().split("T")[0]; // lấy yyyy-mm-dd
};
