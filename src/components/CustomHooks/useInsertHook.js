import axios from "axios";
import app_api_url from "../../Services/app_api_url";
import { useState } from "react";

const useInsertHook = () => {
  const [loading, setLoading] = useState(false);
  const insertData = async (
    apiEndPointName,
    dataToInsert,
    toastModal,
    onSuccess = () => {},
    refreshTable = () => {},
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${app_api_url}/${apiEndPointName}`,
        dataToInsert,
      );

      refreshTable();

      if (response.data.message) {
        toastModal("success", `${response.data.message}`);
        onSuccess();
        setLoading(false);
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Process Failed";
      toastModal("error", errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { insertData, loading };
};
export default useInsertHook;
