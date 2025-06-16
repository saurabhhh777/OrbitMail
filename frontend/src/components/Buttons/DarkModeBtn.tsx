import { userAuthStore } from "../../../store/userAuthStore";
import { Sun, Moon } from "lucide-react";

const DarkModeBtn = () => {
  // Destructure both the boolean and the toggle function from your store
  const { isDarkMode, toggleDarkMode } = userAuthStore();

  return (
    <button onClick={toggleDarkMode} >
        {isDarkMode ? <Moon className="text-white" /> : <Sun  className="text-black"/>}
    </button>
  );
};

export default DarkModeBtn;