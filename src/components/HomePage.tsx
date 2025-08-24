import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waves, Brain, BookOpen, Heart, Sun, Moon } from "lucide-react";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const quickActions = [
    {
      id: 'breathing',
      title: '4-7-8 呼吸法',
      subtitle: '快速放松身心',
      icon: Waves,
      color: 'bg-primary',
      action: () => onNavigate('breathing')
    },
    {
      id: 'meditation',
      title: '冥想练习',
      subtitle: '专注当下时刻',
      icon: Brain,
      color: 'bg-secondary',
      action: () => onNavigate('meditation')
    },
    {
      id: 'articles',
      title: '智慧文章',
      subtitle: '斯多葛哲学',
      icon: BookOpen,
      color: 'bg-accent',
      action: () => onNavigate('articles')
    }
  ];

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: '早安', icon: Sun };
    if (hour < 18) return { text: '下午好', icon: Sun };
    return { text: '晚安', icon: Moon };
  };

  const greeting = greetingTime();
  const GreetingIcon = greeting.icon;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex items-center gap-3 mb-4">
          <GreetingIcon className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-foreground">
            {greeting.text}，欢迎回来
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          今天也要照顾好自己的心灵
        </p>
      </div>

      {/* Daily Quote */}
      <div className="px-6 mb-8">
        <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Heart className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-foreground font-medium mb-2">
                  "你不能控制发生在你身上的事，但你可以控制你对此的反应。"
                </p>
                <p className="text-muted-foreground text-sm">
                  — 爱比克泰德
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 flex-1">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          快速开始
        </h2>
        <div className="grid gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id} 
                className="hover:shadow-lg smooth-transition cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${action.color} p-3 rounded-full flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
    </div>
  );
};