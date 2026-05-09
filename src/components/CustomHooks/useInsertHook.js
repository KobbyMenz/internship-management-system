import axios from "axios";
import app_api_url from "../../app_api_url";

const useInsertHook = () => {
  const insertData = async (
    apiEndPointName,
    dataToInsert,
    toastModal,
    refreshTable,
  ) => {
    try {
      const response = await axios.post(
        `${app_api_url}/${apiEndPointName}`,
        dataToInsert,
      );

      refreshTable();

      if (response.data.message) {
        toastModal("success", `${response.data.message}`);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        toastModal("error", err.response.data.error);
      } else {
        toastModal("error", `Process Failed`);
      }
    }
  };

  return { insertData };
};
export default useInsertHook;
