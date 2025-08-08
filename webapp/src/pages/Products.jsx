import React, { useState } from "react";
import AddEditProductModal from "../components/AddEditProductModal";
import "./Products.css";
import { useProducts } from "../hooks/useProducts";

const Products = ({ products, addProduct, updateProduct, deleteProduct }) => {
  // State cho tìm kiếm, danh mục, modal và chỉnh sửa
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [unit, setUnit] = useState("all");
  const [sortOrder, setSortOrder] = useState("none"); // none | asc | desc
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { categories = [] } = useProducts();
  const { units = [] } = useProducts();
  //Chỉnh ngày
  const parseDate = (d) => {
    if (typeof d === "string" && d.includes("/")) {
      const [day, month, year] = d.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(d);
  };

  // Lọc sản phẩm theo danh mục và từ khoá tìm kiếm
  const filtered = products
    .filter((p) => {
      const matchCat = category === "all" || p.category?.categoryName === category;
      const matchUni = unit === "all" || p.unit?.unitName === unit;
      const matchSearch = p.productName?.toLowerCase().includes(search.toLowerCase());
      return matchUni && matchCat && matchSearch;
    })
    .sort((a, b) => {
      // 1️⃣ Ưu tiên sản phẩm còn hàng
      if (a.quantity === 0 && b.quantity !== 0) return 1;
      if (a.quantity !== 0 && b.quantity === 0) return -1;

      // 2️⃣ Sau đó sắp xếp theo hạn sử dụng nếu cần
      const dateA = parseDate(a.expiryDate);
      const dateB = parseDate(b.expiryDate);

      if (sortOrder === "asc") return dateA - dateB;
      if (sortOrder === "desc") return dateB - dateA;

      return 0; // không sắp xếp theo ngày
    });

  // Gộp sản phẩm theo tên (nếu cần dùng)
  const groupedProducts = filtered.reduce((acc, p) => {
    if (!acc[p.productName]) acc[p.productName] = [];
    acc[p.productName].push(p);
    return acc;
  }, {});

  // Hiển thị form thêm mới
  const handleAdd = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  // Hiển thị form chỉnh sửa
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Lưu sản phẩm sau khi thêm hoặc sửa
  const handleSave = (productData) => {
    if (editProduct && editProduct.productId) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setShowModal(false);
  };
  //Tính ngày
  const getDaysToExpire = (dateStr) => {
    let expiry;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      expiry = new Date(`${year}-${month}-${day}`);
    } else {
      expiry = new Date(dateStr); // định dạng yyyy-mm-dd
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // so sánh chính xác ngày

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return (
    <div className="products-page">
      {/* Tiêu đề và nút thêm */}
      <div className="products-header">
        <h2>📦 Quản lý sản phẩm</h2>
        <button onClick={handleAdd} className="add-button">
          + Thêm sản phẩm
        </button>
      </div>

      {/* Bộ lọc tìm kiếm và danh mục */}
      <div className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm sản phẩm..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Tất cả loại</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryName}>
              {c.categoryName}
            </option>
          ))}
        </select>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="all">Tất cả đơn vị</option>
          {units.map((u) => (
            <option key={u.unitId} value={u.unitName}>
              {u.unitName}
            </option>
          ))}
        </select>
        {/* Sắp xếp theo hạn sử dụng */}
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sắp xếp theo hạn sử dụng</option>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <table className="product-table">
        <thead>
          <tr className="title">
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Hạn sử dụng</th>
            <th>Ngày nhập</th>
            <th>Đơn vị</th>
            <th>Số lượng</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-results">
                Không có sản phẩm.
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.productId}>
                <td>
                  <img src={p.image} alt={p.name} width="50" height="50" />
                </td>
                <td>{p.productName}</td>
                <td>
                  {p.category?.categoryName || "Chưa phân loại"}
                </td>
                <td className={p.quantity <= 0 ? "not-active" : "active"}>
                  <span className={p.status === 'notExpired' ? "notExpired" : "Expired"}>
                    {p.quantity <= 0
                      ? ``
                      : p.status === 'notExpired'
                        ? `Hạn: ${getDaysToExpire(p.expiryDate)} ngày`
                        : "Hết hạn"}
                  </span>
                </td>
                <td>{p.expiryDate}</td>
                <td>{p.detectedAt}</td>
                <td>{p.unit?.unitName || "Không rõ"}</td>
                <td>{p.quantity}</td>
                <td className="note">{p.notes}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(p)}>
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={() => deleteProduct(p.productId || p.id)}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal thêm/sửa sản phẩm */}
      <AddEditProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editProduct}
      />
    </div>
  );
};

export default Products;
