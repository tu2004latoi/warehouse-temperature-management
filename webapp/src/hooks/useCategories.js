import { useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis"
import { usePost } from "./usePost";
import { useFetch } from "./useFetch";

export const useCategories =() =>{
  const {data : cateData, error: err } = useFetch(endpoints.categories);
  const [categories, setCategories] = useState([]);
  const {error: postErr, postData} = usePost(endpoints.categoryAdd);
  useEffect(()=>{ 
    if (cateData){
      setCategories(cateData)
    }
  }, [cateData])

  if(err|| postErr){
    console.error(err)
    return {
      categories:[],
      addCates:() =>{},
      updateCates: ()=>{},
      deleteCates: () => {},
    }
  }
  const addCates = async (cateData) => {
    try{
      const formData = new FormData();

      formData.append("categoryName", cateData.categoryName);
      formData.append("description", cateData.description);

      await postData(formData);
      const data = await Apis.get(endpoints.categories);
      setCategories(data.data);
      
    } catch {
    }
  };
  const deleteCates = async (Id) => {
    await Apis.delete(endpoints.categoryDelete(Id));
    setCategories((prev) => prev.filter((p) => p.categoryId !== Id));
  };
  return {
    categories,
    addCates,
    deleteCates
  };
}
