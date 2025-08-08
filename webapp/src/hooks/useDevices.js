import { useEffect, useState } from "react";
import { endpoints } from "../configs/Apis";
import { useFetch } from "./useFetch";
import { usePost } from "./usePost";
import { usePut } from "./usePut";

export const useDevices = () => {
  const { data: deviceData, error: fetchError } = useFetch(endpoints.devices);
  const {
    isLoading,
    error: postError,
    postData,
  } = usePost(endpoints.deviceAdd);
   const { error: putError, putData } = usePut();
  const [devices, setdevices] = useState([]);

  useEffect(() => {
    if (deviceData) {
      setdevices(deviceData);
    }
  }, [deviceData]);


  if (fetchError || postError || putError) {
    // console.error(fetchError || postError);
    return {
      devices: [],
      adddevice: () => {},
      updatedevice: () => {},
      deletedevice: () => {},
      error: true,
    };
  }

  const adddevice = async (deviceData) => {
    const Data ={};

    Data.deviceName =deviceData.deviceName;
    Data.userId = 1;
    Data.deviceCode =deviceData.deviceCode;
    

    const response = await postData(Data);
    setdevices((prev) => [...prev, response]);
  };

  const updatedevice = async (deviceData) => {
    const Data ={};
    Data.deviceId = deviceData.deviceId;
    Data.deviceName = deviceData.deviceName;
    Data.userId = deviceData.userId;
    Data.deviceCode = deviceData.deviceCode;
    

    const data = await putData(
      endpoints.deviceUpdate(deviceData.deviceId),
      Data
    );
    // Cập nhật sản phẩm trong danh sách
    setdevices((prev) =>
      prev.map((p) => (p.deviceId === data.deviceId ? data : p))
    );
  };

  const deletedevice = (deviceId) => {
    setdevices((prev) => prev.filter((p) => p.deviceId !== deviceId));
  };

  return {
    devices,
    adddevice,
    updatedevice,
    deletedevice,
    isLoading,
  };
};

