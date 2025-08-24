import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Edit3, Save, X, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const UserProfilePage = () => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profile, setProfile] = useState({
    name: '用户',
    email: 'user@example.com',
    bio: '寻找内心平静的旅行者',
  });
  const [editProfile, setEditProfile] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background flow-bg">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground font-serif">
            个人资料
          </h1>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit3 size={18} className="mr-2" />
              编辑
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
              >
                <Save size={16} className="mr-2" />
                保存
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 mb-8">
        <Card className="glass-dark border-0">
          <CardContent className="p-6">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} alt="Profile" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    <User size={32} />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-border/30 bg-card"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={14} />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-muted-foreground">姓名</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                    className="mt-1 bg-secondary/50 border-border/30"
                  />
                ) : (
                  <div className="mt-1 text-foreground font-medium">{profile.name}</div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-muted-foreground">邮箱</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                    className="mt-1 bg-secondary/50 border-border/30"
                  />
                ) : (
                  <div className="mt-1 text-foreground">{profile.email}</div>
                )}
              </div>

              <div>
                <Label htmlFor="bio" className="text-muted-foreground">个人简介</Label>
                {isEditing ? (
                  <Input
                    id="bio"
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                    className="mt-1 bg-secondary/50 border-border/30"
                  />
                ) : (
                  <div className="mt-1 text-foreground">{profile.bio}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-dark border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">127</div>
              <div className="text-sm text-muted-foreground">练习天数</div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">43</div>
              <div className="text-sm text-muted-foreground">文章阅读</div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">2.1h</div>
              <div className="text-sm text-muted-foreground">冥想时长</div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">89</div>
              <div className="text-sm text-muted-foreground">呼吸练习</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings */}
      <div className="px-6">
        <Card className="glass-dark border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 font-serif">设置</h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                通知设置
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                隐私设置
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                关于我们
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};