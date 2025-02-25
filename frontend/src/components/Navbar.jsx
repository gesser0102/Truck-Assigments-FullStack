import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openMenu } from "../features/menuSlice";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path || (path !== "/" && currentPath.startsWith(path));
  };

  return (
    <>
      <nav className="bg-slate-800 p-4 shadow-md border-b-2 border-green-700 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <h1 className="text-white font-bold text-lg">ManageAssignments</h1>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 text-white font-bold">
            {[
              { path: "/", label: "Home" },
              { path: "/drivers", label: "Drivers" },
              { path: "/trucks", label: "Trucks" },
              { path: "/assignments", label: "Assignments" },
            ].map(({ path, label }) => (
              <li key={path} className="relative">
                <Link
                  to={path}
                  className={`pb-2 transition ${
                    isActive(path)
                      ? "text-green-400 border-b-2 border-green-500"
                      : "hover:text-green-400 hover:border-b-2 hover:border-green-400"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white text-xl" onClick={() => dispatch(openMenu())}>
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileMenu />
    </>
  );
};

export default Navbar;
