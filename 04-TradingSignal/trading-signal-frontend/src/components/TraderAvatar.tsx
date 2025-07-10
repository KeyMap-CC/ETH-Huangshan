
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TraderAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export const TraderAvatar = ({ src, name, size = "md" }: TraderAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
