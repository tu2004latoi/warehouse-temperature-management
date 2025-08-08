import { useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";

const Categories = ({ categories, addCates, deleteCates }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Danh sách loại sản phẩm</h1>
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ Thêm loại sản phẩm
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cate) => (
          <div
            key={cate.categoryId}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{cate.categoryName}</h3>
            <p className="text-gray-600">{cate.description}</p>
            <div className="mt-2 flex space-x-2">

              <button
                onClick={() => deleteCates(cate.categoryId)}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addCates}
      />

    </div>
  );
};

export default Categories;

