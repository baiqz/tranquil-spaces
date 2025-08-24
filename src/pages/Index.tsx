import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { HomePage } from "@/components/HomePage";
import { BreathingPage } from "@/components/BreathingPage";
import { MeditationPage } from "@/components/MeditationPage";
import { ArticlesPage } from "@/components/ArticlesPage";
import { ProfilePage } from "@/components/ProfilePage";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'breathing':
        return <BreathingPage />;
      case 'meditation':
        return <MeditationPage />;
      case 'articles':
        return <ArticlesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background flow-bg">
        {renderPage()}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </LanguageProvider>
  );
};

export default Index;
