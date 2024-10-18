import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/protectedRoute";
import Loader from "./components/loader";
import { useSelector } from "react-redux";

function App() {
  const { loader } = useSelector((state) => state.loaderReducer);
  return (
    <div>
      <Toaster position="top-center" />
      {loader && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
