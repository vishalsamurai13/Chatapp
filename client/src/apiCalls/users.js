import { axiosInstance } from "./index";

export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get("api/user/get-logged-user");
    return response.data;
  } catch (error) {
    return error;
  }
};
