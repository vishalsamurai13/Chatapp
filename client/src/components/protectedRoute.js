import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { toast } from "sonner";
import {setUser} from "../redux/usersSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector(state => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLoggedInUser = async () => {
    let response = null;

    try {
      dispatch(showLoader());
      response = await getLoggedUser();
      dispatch(hideLoader());
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
        window.location.href = "/login";
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getLoggedInUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}

export default ProtectedRoute;
