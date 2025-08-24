import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Heart, Award, Settings, Waves, Brain, BookOpen } from "lucide-react";

export const ProfilePage = () => {
  const stats = [
    {
      label: '呼吸练习',
      value: '45',
      unit: '次',
      icon: Waves,
      color: 'bg-primary'
    },
    {
      label: '冥想时长',
      value: '12.5',
      unit: '小时',
      icon: Brain,
      color: 'bg-secondary'
    },
    {
      label: '收藏文章',
      value: '8',
      unit: '篇',
      icon: BookOpen,
      color: 'bg-accent'
    },
    {
      label: '连续天数',
      value: '7',
      unit: '天',
      icon: Calendar,
      color: 'bg-success'
    }
  ];

  const recentActivities = [
    { type: '呼吸练习', title: '4-7-8 呼吸法', time: '今天 14:30', duration: '10 分钟' },
    { type: '冥想', title: '减压冥想', time: '今天 08:15', duration: '15 分钟' },
    { type: '文章', title: '控制你能控制的', time: '昨天 20:45', duration: '3 分钟阅读' },
    { type: '呼吸练习', title: '箱式呼吸法', time: '昨天 16:20', duration: '8 分钟' }
  ];

  const achievements = [
    { title: '初学者', description: '完成第一次练习', earned: true },
    { title: '坚持者', description: '连续7天练习', earned: true },
    { title: '专注达人', description: '累计冥想10小时', earned: true },
    { title: '智慧寻求者', description: '阅读20篇文章', earned: false }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                用户名
              </h1>
              <p className="text-muted-foreground">
                开始使用 Soul Pease 30 天
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          练习统计
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} p-2 rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">
                          {stat.unit}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          最近活动
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      {activity.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.type} • {activity.time}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 flex-1">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          成就徽章
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card 
              key={index}
              className={achievement.earned ? "border-primary/50 bg-primary/5" : "opacity-60"}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-primary' : 'bg-muted'
                }`}>
                  <Award 
                    className={achievement.earned ? 'text-primary-foreground' : 'text-muted-foreground'} 
                    size={24} 
                  />
                </div>
                <div className="font-medium text-foreground text-sm mb-1">
                  {achievement.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {achievement.description}
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