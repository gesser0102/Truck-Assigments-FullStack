import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import DriversList from "../pages/Drivers/DriversList";
import DriverForm from "../pages/Drivers/DriverForm";
import EditDriver from "../pages/Drivers/EditDriver";
import TrucksList from "../pages/Trucks/TrucksList"; 
import TruckForm from "../pages/Trucks/TruckForm";
import EditTruck from "../pages/Trucks/EditTruck";
import Home from "../pages/Home";
import AssignmentsList from "../pages/Assignments/AssignmentsList";
import AddAssignment from "../pages/assignments/AssignmentForm";
import EditAssignment from "../pages/assignments/EditAssignment";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<DriversList />} />
        <Route path="/drivers/new" element={<DriverForm />} />
        <Route path="/drivers/edit/:id" element={<EditDriver />} />
        <Route path="/trucks" element={<TrucksList />} />
        <Route path="/trucks/new" element={<TruckForm />} />
        <Route path="/trucks/edit/:id" element={<EditTruck />} />
        <Route path="/assignments" element={<AssignmentsList />} />
        <Route path="/assignments/new" element={<AddAssignment />} />
        <Route path="/assignments/edit/:id" element={<EditAssignment />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;