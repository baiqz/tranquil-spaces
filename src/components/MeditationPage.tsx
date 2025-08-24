import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Heart, Focus, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type MeditationTheme = 'stress' | 'focus' | 'sleep';

export const MeditationPage = () => {
  const [selectedTheme, setSelectedTheme] = useState<MeditationTheme>('stress');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(600); // 10 minutes

  const themes = {
    stress: {
      name: '减压冥想',
      description: '释放压力，放松身心',
      icon: Heart,
      color: 'from-pink-400 to-rose-400',
      sessions: [
        { title: '深度放松', duration: '10 分钟' },
        { title: '缓解焦虑', duration: '15 分钟' },
        { title: '情绪平衡', duration: '12 分钟' }
      ]
    },
    focus: {
      name: '专注冥想',
      description: '提升专注力，增强效率',
      icon: Focus,
      color: 'from-blue-400 to-cyan-400',
      sessions: [
        { title: '注意力训练', duration: '8 分钟' },
        { title: '心流状态', duration: '20 分钟' },
        { title: '清晰思维', duration: '15 分钟' }
      ]
    },
    sleep: {
      name: '睡眠冥想',
      description: '安然入眠，深度休息',
      icon: Moon,
      color: 'from-indigo-400 to-purple-400',
      sessions: [
        { title: '睡前放松', duration: '12 分钟' },
        { title: '深度睡眠', duration: '25 分钟' },
        { title: '午休小憩', duration: '6 分钟' }
      ]
    }
  };

  const currentTheme = themes[selectedTheme];
  const ThemeIcon = currentTheme.icon;
  const progress = (currentTime / duration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          冥想练习
        </h1>
        <p className="text-muted-foreground">
          选择适合你的冥想主题，开始内心之旅
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

      {/* Current Session */}
      <div className="px-6 mb-8">
        <Card className="overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${currentTheme.color} flex items-center justify-center`}>
            <ThemeIcon className="text-white" size={48} />
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {currentTheme.name}
            </h2>
            <p className="text-muted-foreground mb-4">
              {currentTheme.description}
            </p>
            
            {/* Current Session Info */}
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">正在播放</div>
              <div className="font-semibold text-foreground">
                {currentTheme.sessions[0].title}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <Button size="sm" variant="ghost">
                <SkipBack size={20} />
              </Button>
              
              <Button
                size="lg"
                className={cn(
                  "w-16 h-16 rounded-full",
                  isPlaying 
                    ? "bg-muted text-muted-foreground hover:bg-muted/80" 
                    : "bg-success text-success-foreground hover:bg-success/90"
                )}
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              
              <Button size="sm" variant="ghost">
                <SkipForward size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session List */}
      <div className="px-6 flex-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {currentTheme.name}课程
        </h3>
        <div className="grid gap-3">
          {currentTheme.sessions.map((session, index) => (
            <Card key={index} className="hover:shadow-md smooth-transition cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {session.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {session.duration}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
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