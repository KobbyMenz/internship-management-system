import axios from "axios";
import app_api_url from "../../app_api_url";

const useUpdateHook = () => {
  const updateData = async (
    apiEndPointName,
    dataToUpdate,
    toastModal,
    refreshTable = () => {
      // Default empty function if no refresh is needed
    }, // Optional callback to refresh data after update
  ) => {
    try {
      const response = await axios.put(
        `${app_api_url}/${apiEndPointName}`,
        dataToUpdate,
      );

      refreshTable();

      if (response.data.message) {
        toastModal("success", `${response.data.message}`);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        toastModal("error", err.response.data.error);
      } else {
        toastModal("error", "Process Failed");
      }
    }
  };

  return { updateData };
};

export default useUpdateHook;
