import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const BreathingPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [method, setMethod] = useState<'478' | 'box'>('478');
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const methods = {
    '478': {
      name: '4-7-8 呼吸法',
      description: '吸气4秒，憋气7秒，呼气8秒',
      phases: { inhale: 4, hold: 7, exhale: 8 }
    },
    'box': {
      name: '箱式呼吸法',
      description: '吸气4秒，憋气4秒，呼气4秒，憋气4秒',
      phases: { inhale: 4, hold: 4, exhale: 4 }
    }
  };

  const currentMethod = methods[method];
  const currentPhase = currentMethod.phases[phase as keyof typeof currentMethod.phases];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= currentPhase - 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
            } else if (phase === 'hold') {
              setPhase('exhale');
            } else {
              setPhase('inhale');
              setCycle(c => c + 1);
            }
            return 0;
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
  }, [isActive, phase, currentPhase]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(0);
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return '深吸气';
      case 'hold': return '屏住呼吸';
      case 'exhale': return '慢慢呼气';
      default: return '';
    }
  };

  const getAnimationClass = () => {
    if (!isActive) return '';
    switch (phase) {
      case 'inhale': return 'animate-breathe-in';
      case 'hold': return 'animate-breathe-hold';
      case 'exhale': return 'animate-breathe-out';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          呼吸练习
        </h1>
        <p className="text-muted-foreground">
          跟随指导调节呼吸，找到内心平静
        </p>
      </div>

      {/* Method Selection */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(methods).map(([key, methodInfo]) => (
            <Button
              key={key}
              variant={method === key ? "default" : "outline"}
              className={cn(
                "h-auto p-4 text-left border-0 shadow-sm",
                method === key ? "bg-primary text-primary-foreground shadow-md" : "bg-card"
              )}
              onClick={() => {
                setMethod(key as '478' | 'box');
                handleReset();
              }}
            >
              <div>
                <div className="font-semibold mb-1">{methodInfo.name}</div>
                <div className="text-xs opacity-80">
                  {methodInfo.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Breathing Circle */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative">
          {/* Animated Circle */}
          <div 
            className={cn(
              "w-64 h-64 rounded-full bg-secondary border border-border/20",
              "flex flex-col items-center justify-center shadow-lg",
              getAnimationClass()
            )}
          >
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground mb-3">
                {getPhaseText()}
              </div>
              <div className="text-5xl font-mono font-bold text-foreground mb-2">
                {currentPhase - timer}
              </div>
              <div className="text-sm text-muted-foreground">
                第 {cycle + 1} 轮
              </div>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {['inhale', 'hold', 'exhale'].map((p) => (
              <div
                key={p}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  phase === p ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-24">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-center gap-4 mb-6">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  <Play className="mr-2" size={20} />
                  开始练习
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="border-0 bg-secondary hover:bg-secondary/80 px-8"
                >
                  <Pause className="mr-2" size={20} />
                  暂停
                </Button>
              )}
              
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="border-0 bg-secondary hover:bg-secondary/80"
              >
                <RotateCcw size={20} />
              </Button>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                已完成 <span className="font-semibold text-foreground">{cycle}</span> 个完整周期
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};