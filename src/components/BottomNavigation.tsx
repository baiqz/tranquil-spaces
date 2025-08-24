import { Home, Waves, Brain, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'breathing', label: t('breathing'), icon: Waves },
    { id: 'meditation', label: t('meditation'), icon: Brain },
    { id: 'articles', label: t('articles'), icon: BookOpen },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-border/30 z-50">
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
                "hover:bg-primary/10 active:scale-95",
                isActive && "bg-primary/20 text-primary border border-primary/30"
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