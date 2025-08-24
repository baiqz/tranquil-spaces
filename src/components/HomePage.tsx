import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waves, Brain, BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const { t } = useLanguage();
  
  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早安';
    if (hour < 18) return '下午好';
    return '晚安';
  };

  const quickActions = [
    {
      id: 'breathing',
      title: t('breathingExercise'),
      subtitle: '调节呼吸，平静心神',
      icon: Waves,
      action: () => onNavigate('breathing')
    },
    {
      id: 'meditation',
      title: t('guidedMeditation'),
      subtitle: '专注当下，内心宁静',
      icon: Brain,
      action: () => onNavigate('meditation')
    },
    {
      id: 'articles',
      title: t('stoicWisdom'),
      subtitle: '古老智慧，现代应用',
      icon: BookOpen,
      action: () => onNavigate('articles')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background flow-bg">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">
              {greetingTime()}
            </h1>
            <p className="text-lg text-muted-foreground">
              今天也要好好照顾自己
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Daily Quote Card */}
      <div className="px-6 mb-8">
        <Card className="glass-dark border-0 shadow-lg animate-glass-float">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-3 leading-relaxed font-serif">
                "你不能控制发生在你身上的事，但你可以控制你对此的反应。"
              </p>
              <p className="text-sm text-muted-foreground">
                爱比克泰德
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 flex-1">
        <div className="space-y-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id} 
                className="glass-dark border-0 shadow-lg hover:shadow-xl smooth-transition cursor-pointer active:scale-[0.98] animate-fade-in"
                onClick={action.action}
                style={{ animationDelay: `${quickActions.indexOf(action) * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1 font-serif">
                          {action.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground" size={20} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-24 mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">
          {t('todayPractice')}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-dark border-0 shadow-lg animate-glass-float">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">3</div>
              <div className="text-xs text-muted-foreground">呼吸练习</div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-0 shadow-lg animate-glass-float" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">15</div>
              <div className="text-xs text-muted-foreground">冥想分钟</div>
            </CardContent>
          </Card>
          <Card className="glass-dark border-0 shadow-lg animate-glass-float" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">2</div>
              <div className="text-xs text-muted-foreground">文章阅读</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};