import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Music, Settings, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MeditationPlayerProps {
  onBack: () => void;
  title: string;
  duration: string;
}

const whiteNoiseOptions = [
  { id: 'none', name: 'none', url: null },
  { id: 'whitenoise', name: 'whitenoise', url: '/audio/whitenoise.mp3' },
  { id: 'brownian', name: 'brownian', url: '/audio/brownian.mp3' },
  { id: 'pink', name: 'pink', url: '/audio/pink.mp3' },
  { id: 'rain', name: 'rain', url: '/audio/rain.mp3' },
  { id: 'forest', name: 'forest', url: '/audio/forest.mp3' },
  { id: 'ocean', name: 'ocean', url: '/audio/ocean.mp3' },
];

export const MeditationPlayerPage: React.FC<MeditationPlayerProps> = ({ 
  onBack, 
  title, 
  duration 
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(600); // 10 minutes
  const [selectedNoise, setSelectedNoise] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalTime]);

  const handlePlay = async () => {
    if (isPlaying) {
      handlePause();
      return;
    }

    try {
      // Start white noise if selected
      if (selectedNoise !== 'none' && audioRef.current) {
        const noiseOption = whiteNoiseOptions.find(option => option.id === selectedNoise);
        if (noiseOption?.url) {
          audioRef.current.src = noiseOption.url;
          audioRef.current.volume = 0.4;
          audioRef.current.loop = true;
          await audioRef.current.play();
        }
      }

      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / totalTime) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background flow-bg">
      {/* Header */}
      <div className="pt-16 pb-6 px-6 border-b border-border/30 glass-dark">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t('back')}
        </Button>
        
        <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight font-serif">
          {title}
        </h1>
        
        <p className="text-muted-foreground">
          {duration} • 冥想引导
        </p>
      </div>

      {/* Meditation Circle */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="relative">
          <div 
            className={cn(
              "w-80 h-80 rounded-full glass-dark border border-border/20",
              "flex flex-col items-center justify-center shadow-2xl",
              isPlaying && "animate-pulse"
            )}
          >
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-foreground mb-4">
                {formatTime(currentTime)}
              </div>
              <div className="text-lg text-muted-foreground mb-2">
                / {formatTime(totalTime)}
              </div>
              <div className="text-sm text-muted-foreground">
                {isPlaying ? '正在冥想...' : '准备开始'}
              </div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6">
        <Card className="glass-dark border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  onClick={handlePlay}
                  className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary w-16 h-16 rounded-full"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                <Volume2 size={20} className="text-muted-foreground" />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings size={18} />
              </Button>
            </div>

            {/* White Noise Settings */}
            {showSettings && (
              <div className="pt-4 border-t border-border/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Music size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">白噪音</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {whiteNoiseOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNoise(option.id)}
                        className={cn(
                          "border-border/30 text-xs",
                          selectedNoise === option.id && "bg-primary/20 border-primary/30 text-primary"
                        )}
                      >
                        {t(option.name)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />
      
      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};