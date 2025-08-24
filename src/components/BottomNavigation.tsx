import { Home, Waves, Brain, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'breathing', label: '呼吸', icon: Waves },
  { id: 'meditation', label: '冥想', icon: Brain },
  { id: 'articles', label: '文章', icon: BookOpen },
  { id: 'profile', label: '我的', icon: User },
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/30 backdrop-blur-md">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl smooth-transition min-w-[60px]",
                "hover:bg-secondary/50 active:scale-95",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon 
                size={22} 
                className={cn(
                  "transition-colors duration-200 mb-1",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};