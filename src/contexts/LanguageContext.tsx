import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  zh: {
    // Navigation
    home: '首页',
    breathing: '呼吸',
    meditation: '冥想',
    articles: '文章',
    profile: '我的',
    
    // Home page
    welcomeBack: '欢迎回来',
    todayPractice: '今日练习',
    minutes: '分钟',
    sessions: '次',
    streakDays: '连续天数',
    quickStart: '快速开始',
    breathingExercise: '呼吸练习',
    guidedMeditation: '引导冥想',
    readArticles: '阅读文章',
    
    // Articles
    stoicWisdom: '斯多葛智慧',
    ancientWisdomModernApplication: '古老的智慧，现代的应用',
    readTime: '阅读时间',
    readFullArticle: '阅读全文',
    favorite: '收藏',
    favorited: '已收藏',
    back: '返回',
    
    // TTS and audio
    playAudio: '播放音频',
    pauseAudio: '暂停音频',
    backgroundMusic: '背景音乐',
    voice: '语音',
    none: '无',
    rain: '雨声',
    forest: '森林',
    ocean: '海洋',
    whitenoise: '白噪音',
    brownian: '棕噪音',
    pink: '粉噪音',
    default: '默认',
    male: '男声',
    female: '女声',
    calm: '平静',
    warm: '温暖',
    loading: '加载中',
    
    // Categories
    uncategorized: '未分类',
    'core-principles': '核心原则', 
    'practice-guide': '实践指南',
    mindfulness: '正念练习',
    philosophy: '哲学思考',
    
    // Breathing
    breathingGuide: '呼吸指导',
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    
    // Common
    start: '开始',
    stop: '停止',
    close: '关闭',
    settings: '设置',
  },
  en: {
    // Navigation
    home: 'Home',
    breathing: 'Breathing',
    meditation: 'Meditation',
    articles: 'Articles',
    profile: 'Profile',
    
    // Home page
    welcomeBack: 'Welcome Back',
    todayPractice: 'Today\'s Practice',
    minutes: 'minutes',
    sessions: 'sessions',
    streakDays: 'day streak',
    quickStart: 'Quick Start',
    breathingExercise: 'Breathing Exercise',
    guidedMeditation: 'Guided Meditation',
    readArticles: 'Read Articles',
    
    // Articles
    stoicWisdom: 'Stoic Wisdom',
    ancientWisdomModernApplication: 'Ancient wisdom, modern application',
    readTime: 'read time',
    readFullArticle: 'Read full article',
    favorite: 'Favorite',
    favorited: 'Favorited',
    back: 'Back',
    
    // TTS and audio
    playAudio: 'Play Audio',
    pauseAudio: 'Pause Audio',
    backgroundMusic: 'Background Music',
    voice: 'Voice',
    none: 'None',
    rain: 'Rain',
    forest: 'Forest',
    ocean: 'Ocean',
    whitenoise: 'White Noise',
    brownian: 'Brown Noise',
    pink: 'Pink Noise',
    default: 'Default',
    male: 'Male',
    female: 'Female',
    calm: 'Calm',
    warm: 'Warm',
    loading: 'Loading',
    
    // Categories
    uncategorized: 'Uncategorized',
    'core-principles': 'Core Principles',
    'practice-guide': 'Practice Guide',
    mindfulness: 'Mindfulness',
    philosophy: 'Philosophy',
    
    // Breathing
    breathingGuide: 'Breathing Guide',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    
    // Common
    start: 'Start',
    stop: 'Stop',
    close: 'Close',
    settings: 'Settings',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};