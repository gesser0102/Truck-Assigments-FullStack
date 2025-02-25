import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "../features/menuSlice";

const MobileMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOpen = useSelector((state) => state.menu.isOpen);
  const currentPath = location.pathname;

  // Define active menu logic to include subpaths like "/new" or "/edit"
  const isActive = (path) => {
    return (
      currentPath === path ||
      (path !== "/" && currentPath.startsWith(path)) // Matches "/drivers", "/drivers/new", "/drivers/edit/..."
    );
  };

  return (
    <>
      {/* Overlay Background (closes menu on click) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => dispatch(closeMenu())}
      ></div>

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 z-100 w-64 h-full bg-slate-800 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button (always visible) */}
        <div className="flex justify-end p-4">
          <button
            className="text-white text-2xl hover:text-red-400 transition"
            onClick={() => dispatch(closeMenu())}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="text-white space-y-6 mt-4 p-6 text-lg">
          {[
            { path: "/", label: "Home" },
            { path: "/drivers", label: "Drivers" },
            { path: "/trucks", label: "Trucks" },
            { path: "/assignments", label: "Assignments" },
          ].map(({ path, label }) => (
            <li key={path} className="relative">
              <Link
                to={path}
                onClick={() => dispatch(closeMenu())}
                className={`block pb-2 transition ${
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
      </div>
    </>
  );
};

export default MobileMenu;
