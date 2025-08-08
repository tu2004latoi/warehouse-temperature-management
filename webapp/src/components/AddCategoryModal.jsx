import React, { useState } from "react";

const AddCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    setForm({ categoryName: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm loại sản phẩm</h2>
        <input
          type="text"
          name="categoryName"
          placeholder="Tên loại"
          value={form.categoryName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="text"
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Hủy</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;

