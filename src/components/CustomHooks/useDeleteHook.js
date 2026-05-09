import axios from "axios";
import app_api_url from "../../app_api_url";

const useDeleteHook = () => {
  const deleteData = async (apiEndPointName, toastModal, refreshTable) => {
    try {
      const response = await axios.delete(`${app_api_url}/${apiEndPointName}`);
      refreshTable();

      if (response.data.message) {
        toastModal("success", `${response.data.message}`);
      }
      
    } catch (err) {
      if (err.response?.data?.error) {
        toastModal("error", err.response.data.error);
      } else {
        toastModal("error", `Process failed`);
      }
    }
  };

  return { deleteData };
};
export default useDeleteHook;
