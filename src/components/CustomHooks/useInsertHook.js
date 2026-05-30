import axios from "axios";
import app_api_url from "../../Services/app_api_url";

const useInsertHook = () => {
  const insertData = async (
    apiEndPointName,
    dataToInsert,
    toastModal,
    onSuccess = () => {},
    refreshTable = () => {},
  ) => {
    try {
      const response = await axios.post(
        `${app_api_url}/${apiEndPointName}`,
        dataToInsert,
      );

      refreshTable();

      if (response.data.message) {
        toastModal("success", `${response.data.message}`);
        onSuccess();
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Process Failed";
      toastModal("error", errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return { insertData };
};
export default useInsertHook;
