import axios from "axios";
import app_api_url from "../../app_api_url";

const useInsertMultiPartsHook = () => {
  const insertMultiPartsData = async (
    apiEndPointName,
    dataToInsert,
    toastModal,
    refreshTable,
  ) => {
    try {
      const response = await axios.post(
        `${app_api_url}/${apiEndPointName}`,
        dataToInsert,
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
        toastModal("error", `Process Failed`);
      }
    }
  };

  return { insertMultiPartsData };
};
export default useInsertMultiPartsHook;
