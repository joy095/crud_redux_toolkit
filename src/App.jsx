import { Route, Routes } from "react-router-dom";
import EditUser from "./features/user/EditUser";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<EditUser />} />
      </Routes>
    </div>
  );
};

export default App;
