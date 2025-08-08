import { useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { useFetch } from "./useFetch";
import { usePost } from "./usePost";
import { usePut } from "./usePut";
import { useAuth } from "../context/AuthContext";

export const useProducts = () => {
  const { user } = useAuth();
  const { data: productData, error: fetchError } = useFetch(endpoints.products);
  const {
    isLoading,
    error: postError,
    postData,
  } = usePost(endpoints.productAdd);
  const { data: catesData, error: fetchError1 } = useFetch(
    endpoints.categories
  );
  const { data: unitsData, error: fetchError2 } = useFetch(endpoints.units);
  const { error: putError, putData } = usePut(endpoints.productUpdate);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (user && productData) {
      setProducts(productData);
    }
  }, [user, productData]);

  useEffect(() => {
    if (user) {
      if (catesData) {
        setCategories(catesData);
      }
      if (unitsData) {
        setUnits(unitsData);
      }
    }
  }, [user, catesData, unitsData]);

  if (fetchError || postError || fetchError1 || fetchError2 || putError) {
    // console.error(fetchError || postError);
    return {
      products: [],
      addProduct: () => { },
      updateProduct: () => { },
      deleteProduct: () => { },
      error: true,
    };
  }

  const addProduct = async (productData) => {
    try {
      const formData = new FormData();

      formData.append("productName", productData.productName);
      formData.append("userId", user.userId);
      formData.append("categoryId", productData.categoryId);
      formData.append("expiryDate", productData.expiryDate); // dạng yyyy-MM-dd
      formData.append("detectedAt", productData.detectedAt); // dạng yyyy-MM-ddTHH:mm:ss
      formData.append("unitId", productData.unitId);
      formData.append("quantity", productData.quantity);
      formData.append("notes", productData.notes);
      formData.append("status", productData.status);
      formData.append("file", productData.file); // Đây phải là File từ input type="file"

      await postData(formData);
      const data = await Apis.get(endpoints.products);
      setProducts(data.data);

    } finally {
    }
  };

  const updateProduct = async (p) => {
    try {
      if (p === null) {
        return;
      }

      const formData = new FormData();
      formData.append("productId", p.productId);
      formData.append("productName", p.productName);
      formData.append("userId", user.userId);
      formData.append("categoryId", p.categoryId);
      formData.append("expiryDate", p.expiryDate);
      formData.append("detectedAt", p.detectedAt);
      formData.append("quantity", p.quantity);
      formData.append("notes", p.notes);
      formData.append("status", p.status);
      formData.append("file", p.file);

      console.log("Data truoc khi put: ")
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await putData(formData);
      console.log("data tra ve", response);

      // Cập nhật sản phẩm trong danh sách
      const data = await Apis.get(endpoints.products);
      setProducts(data.data);

      return response;

    } finally {
    }
  };

  const deleteProduct = async (productId) => {
    await Apis.delete(endpoints.productDelete(productId));
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    units,
    isLoading
  };
};