import React, { useState, useEffect } from "react";
import "./AddEditProductModal.css";
import { useProducts } from "../hooks/useProducts";
import { formatDate } from "../utils/formatters";
const defaultForm = {
	productId: "",
	productName: "",
	categoryId: "",
	quantity: 0,
	image: "",
	status: "notExpired",
	expiryDate: "",
	detectedAt: "",
	unitId: "",
	notes: "",
	file: null
};

const AddEditProductModal = ({ isOpen, onClose, onSave, initialData }) => {
	const { categories = [], units = [] } = useProducts()
	const [form, setForm] = useState(defaultForm);

	useEffect(() => {
		if (initialData) {
			console.log("data", initialData)
			setForm({
				productId: initialData.productId,
				productName: initialData.productName || "",
				quantity: initialData.quantity || 0,
				image: initialData.image || "",
				status: initialData.status || "",
				expiryDate: formatDate(initialData.expiryDate),
				detectedAt: formatDate(initialData.detectedAt),
				notes: initialData.notes || "",
				categoryId: initialData.category?.categoryId || "",
				unitId: initialData.unit?.unitId || "",
				file: null
			});

		} else {
			setForm(defaultForm);
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fileInput = document.querySelector("#productFile");
		const file = fileInput?.files[0] || form.file;

		const finalData = {
			productId: form.productId,
			userId: 1,
			productName: form.productName,
			categoryId: Number(form.categoryId),
			unitId: Number(form.unitId),
			expiryDate: form.expiryDate,
			detectedAt: form.detectedAt + "T00:00:00", // ISO datetime
			quantity: parseFloat(form.quantity),
			notes: form.notes,
			status: form.status,
			image: form.image,
			file: file,
		};

		try {
			await onSave(finalData); // Chờ lưu xong
			onClose();
			setForm(defaultForm);
		} catch (error) {
			console.error("Lỗi lưu sản phẩm:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal modern">
				<h2>{initialData ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h2>
				<form onSubmit={handleSubmit} className="form-modern">
					<div className="form-row">
						{form.image && (
							<div className="image-preview">
								<img src={form.image} alt="Preview" />
							</div>
						)}
						<div className="form-group">
							<input
								id="image"
								name="image"
								value={form.image}
								onChange={handleChange}
								placeholder=" "
							/>
							<label htmlFor="image">Link ảnh</label>
							<input
								type="file"
								id="productFile"
								onChange={(e) => setForm(prev => ({ ...prev, file: e.target.files[0] }))}
							/>
						</div>
					</div>
					<div className="form-row">
						<div className="form-group">
							<input
								id="productName"
								name="productName"
								value={form.productName}
								onChange={handleChange}
								required
								placeholder=" "
							/>
							<label htmlFor="productName">Tên sản phẩm</label>
						</div>
						<div className="form-group">
							<input
								id="quantity"
								name="quantity"
								type="number"
								min="0"
								value={form.quantity}
								onChange={handleChange}
								placeholder=" "
								required
							/>
							<label htmlFor="quantity">Số lượng</label>
						</div>

					</div>

					<div className="form-row">
						<div className="form-group">
							<select
								id="category"
								name="categoryId"
								value={form.categoryId}
								onChange={handleChange}
								required
							>
								<option hidden disabled></option>
								{categories.map((c) => (

									<option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
								))}
							</select>
							<label htmlFor="category">Danh mục</label>
						</div>


						<div className="form-group">
							<select
								id="unit"
								name="unitId"
								value={form.unitId}
								onChange={handleChange}
								required
							>
								<option hidden disabled></option>
								{units.map((c) => (
									<option key={c.unitId} value={c.unitId}>{c.unitName}</option>
								))}
							</select>
							<label htmlFor="unit">Đơn vị</label>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group serect">
							<div className="form-group ">
								<input
									id="expiryDate"
									name="expiryDate"
									type="date"
									value={form.expiryDate}
									onChange={handleChange}
									placeholder=" "
								/>
								<label htmlFor="expiryDate">Hạn sử dụng</label>
							</div>
							<div className="form-group ">
								<input
									id="detectedAt"
									name="detectedAt"
									type="date"
									value={form.detectedAt}
									onChange={handleChange}
									placeholder=" "
								/>
								<label htmlFor="detectedAt">Ngày nhập hàng</label>
							</div>
							<div className="form-group ">
								<select
									id="status"
									name="status"
									value={form.status}
									onChange={handleChange}
									required
								>
									<option value="notExpired">Còn hạn</option>
									<option value="expired">Hết hạn</option>
									<option value="notActive">Hết sản phẩm</option>
								</select>
								<label htmlFor="status">Trạng thái</label>
							</div>
						</div>
						<div className="form-group">
							<textarea
								id="notes"
								name="notes"
								value={form.notes}
								onChange={handleChange}
								placeholder=" "
							/>
							<label htmlFor="notes">Ghi chú</label>
						</div>
					</div>





					<div className="modal-buttons">
						<button type="submit" className="save-btn">💾 Lưu</button>
						<button type="button" onClick={onClose} className="cancel-btn">❌ Hủy</button>
					</div>
				</form>
			</div >
		</div >
	);
};

export default AddEditProductModal;

