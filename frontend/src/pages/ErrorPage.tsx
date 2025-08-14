import { userAuthStore } from "../../store/userAuthStore";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  const { isDarkMode } = userAuthStore();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
      isDarkMode ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]"
    }`}>
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? '#525252' : '#A3A3A3'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? '#525252' : '#A3A3A3'} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className={`text-8xl font-bold mb-4 font-poppins ${
          isDarkMode ? "text-[#3B82F6]" : "text-[#3B82F6]"
        }`}>
          404
        </div>
        
        <h1 className={`text-3xl font-bold mb-4 font-poppins ${
          isDarkMode ? "text-[#FAFAFA]" : "text-[#0A0A0A]"
        }`}>
          Page Not Found
        </h1>
        
        <p className={`text-lg mb-8 max-w-md mx-auto font-jost ${
          isDarkMode ? "text-[#A3A3A3]" : "text-[#525252]"
        }`}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors font-poppins ${
              isDarkMode
                ? "bg-[#262626] text-[#D4D4D4] hover:bg-[#404040] border border-[#404040]"
                : "bg-[#F5F5F5] text-[#404040] hover:bg-[#E5E5E5] border border-[#E5E5E5]"
            }`}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors font-poppins ${
              isDarkMode
                ? "bg-[#3B82F6] text-[#FAFAFA] hover:bg-[#2563EB]"
                : "bg-[#3B82F6] text-[#FAFAFA] hover:bg-[#2563EB]"
            }`}
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;