import { Link } from "react-router-dom";
import logoImage from "@/assets/linkzzz-logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-opacity hover:opacity-80 ${className}`}
    >
      <img 
        src={logoImage} 
        alt="Linkzzz" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;
