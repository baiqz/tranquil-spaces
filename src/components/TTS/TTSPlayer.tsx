import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, Music, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TTSPlayerProps {
  text: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

const backgroundMusicOptions = [
  { id: 'none', name: 'none', url: null },
  { id: 'rain', name: 'rain', url: '/audio/rain.mp3' },
  { id: 'forest', name: 'forest', url: '/audio/forest.mp3' },
  { id: 'ocean', name: 'ocean', url: '/audio/ocean.mp3' },
  { id: 'whitenoise', name: 'whitenoise', url: '/audio/whitenoise.mp3' },
  { id: 'brownian', name: 'brownian', url: '/audio/brownian.mp3' },
  { id: 'pink', name: 'pink', url: '/audio/pink.mp3' },
];

const voiceOptions = [
  { id: 'default', name: 'default', value: null },
  { id: 'male', name: 'male', value: 'zh-CN-YunyangNeural' },
  { id: 'female', name: 'female', value: 'zh-CN-XiaoxiaoNeural' },
  { id: 'calm', name: 'calm', value: 'zh-CN-YunjianNeural' },
  { id: 'warm', name: 'warm', value: 'zh-CN-XiaoyouNeural' },
];

export const TTSPlayer: React.FC<TTSPlayerProps> = ({ 
  text, 
  onPlay, 
  onPause, 
  className 
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState('none');
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [showSettings, setShowSettings] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const synthesizeSpeech = async (text: string): Promise<string> => {
    try {
      // This would typically call your TTS service
      // For now, using browser's built-in speech synthesis
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if selected
        if (selectedVoice !== 'default') {
          const voices = speechSynthesis.getVoices();
          const selectedVoiceObj = voices.find(voice => 
            voice.name.includes('Chinese') || voice.lang.includes('zh')
          );
          if (selectedVoiceObj) {
            utterance.voice = selectedVoiceObj;
          }
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.onend = () => resolve('completed');
        utterance.onerror = (e) => reject(e);
        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      console.error('TTS Error:', error);
      throw error;
    }
  };

  const handlePlay = async () => {
    if (isPlaying) {
      handlePause();
      return;
    }

    setIsLoading(true);
    
    try {
      // Start background music if selected
      if (backgroundMusic !== 'none' && backgroundAudioRef.current) {
        const musicOption = backgroundMusicOptions.find(option => option.id === backgroundMusic);
        if (musicOption?.url) {
          backgroundAudioRef.current.src = musicOption.url;
          backgroundAudioRef.current.volume = 0.3;
          backgroundAudioRef.current.loop = true;
          await backgroundAudioRef.current.play();
        }
      }

      // Start TTS
      await synthesizeSpeech(text);
      setIsPlaying(true);
      onPlay?.();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    speechSynthesis.cancel();
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
    setIsPlaying(false);
    onPause?.();
  };

  useEffect(() => {
    const handleSpeechEnd = () => {
      setIsPlaying(false);
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };

    return () => {
      speechSynthesis.cancel();
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main TTS Controls */}
      <Card className="glass-dark p-4 border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handlePlay}
              disabled={isLoading}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
              <span className="ml-2">
                {isLoading ? t('loading') : isPlaying ? t('pauseAudio') : t('playAudio')}
              </span>
            </Button>
            <Volume2 size={16} className="text-muted-foreground" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={16} />
          </Button>
        </div>

        {/* Voice and Background Music Settings */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="space-y-4">
              {/* Voice Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Volume2 size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{t('voice')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {voiceOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVoice(option.id)}
                      className={cn(
                        "border-border/30 text-xs",
                        selectedVoice === option.id && "bg-primary/20 border-primary/30 text-primary"
                      )}
                    >
                      {t(option.name)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Background Music */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Music size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{t('backgroundMusic')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {backgroundMusicOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setBackgroundMusic(option.id)}
                      className={cn(
                        "border-border/30 text-xs",
                        backgroundMusic === option.id && "bg-primary/20 border-primary/30 text-primary"
                      )}
                    >
                      {t(option.name)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Hidden audio element for background music */}
      <audio ref={backgroundAudioRef} preload="none" />
    </div>
  );
};