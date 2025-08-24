import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, Focus, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MeditationPlayerPage } from "./MeditationPlayerPage";

type MeditationTheme = 'stress' | 'focus' | 'sleep';

export const MeditationPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<MeditationTheme>('stress');
  const [selectedSession, setSelectedSession] = useState<{title: string, duration: string} | null>(null);

  const themes = {
    stress: {
      name: '减压白噪音',
      description: '放松身心的自然声音',
      icon: Heart,
      color: 'from-pink-400 to-rose-400',
      sessions: [
        { title: '雨声放松', duration: '10 分钟' },
        { title: '森林白噪音', duration: '15 分钟' },
        { title: '海洋声音', duration: '12 分钟' }
      ]
    },
    focus: {
      name: '专注白噪音',
      description: '提升专注力的背景音',
      icon: Focus,
      color: 'from-blue-400 to-cyan-400',
      sessions: [
        { title: '白噪音专注', duration: '8 分钟' },
        { title: '棕噪音深度专注', duration: '20 分钟' },
        { title: '粉噪音思考', duration: '15 分钟' }
      ]
    },
    sleep: {
      name: '睡眠白噪音',
      description: '助眠的舒缓声音',
      icon: Moon,
      color: 'from-indigo-400 to-purple-400',
      sessions: [
        { title: '睡前白噪音', duration: '12 分钟' },
        { title: '深度睡眠声音', duration: '25 分钟' },
        { title: '午休白噪音', duration: '6 分钟' }
      ]
    }
  };

  const currentTheme = themes[selectedTheme];
  const ThemeIcon = currentTheme.icon;

  if (selectedSession) {
    return (
      <MeditationPlayerPage
        onBack={() => setSelectedSession(null)}
        title={selectedSession.title}
        duration={selectedSession.duration}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">
          白噪音冥想
        </h1>
        <p className="text-muted-foreground">
          选择舒缓的背景音，开始你的冥想之旅
        </p>
      </div>

      {/* Theme Selection */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(themes).map(([key, theme]) => {
            const Icon = theme.icon;
            return (
              <Button
                key={key}
                variant={selectedTheme === key ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 flex flex-col gap-2",
                  selectedTheme === key && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedTheme(key as MeditationTheme)}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{theme.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Featured Theme */}
      <div className="px-6 mb-8">
        <Card className="glass-dark border-0 overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${currentTheme.color} flex items-center justify-center`}>
            <ThemeIcon className="text-white" size={48} />
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-2 font-serif">
              {currentTheme.name}
            </h2>
            <p className="text-muted-foreground mb-4">
              {currentTheme.description}
            </p>
            
            <Button
              onClick={() => setSelectedSession(currentTheme.sessions[0])}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
            >
              <Play className="mr-2" size={16} />
              开始体验
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Session List */}
      <div className="px-6 flex-1">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-serif">
          {currentTheme.name}音频
        </h3>
        <div className="grid gap-3">
          {currentTheme.sessions.map((session, index) => (
            <Card 
              key={index} 
              className="glass-dark border-0 hover:shadow-md smooth-transition cursor-pointer active:scale-[0.98]"
              onClick={() => setSelectedSession(session)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground font-serif">
                      {session.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {session.duration}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    <Play size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};