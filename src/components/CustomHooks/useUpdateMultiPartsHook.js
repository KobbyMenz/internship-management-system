import axios from "axios";
import app_api_url from "../../app_api_url";

const useUpdateMultiPartsHook = () => {
  const updateMultiPartsData = async (
    apiEndPointName,
    dataToUpdate,
    toastModal,
    refreshTable,
  ) => {
    try {
      const response = await axios.put(
        `${app_api_url}/${apiEndPointName}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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

  return { updateMultiPartsData };
};

export default useUpdateMultiPartsHook;
