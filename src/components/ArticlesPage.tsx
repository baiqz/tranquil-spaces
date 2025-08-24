import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Heart, ArrowLeft, Plus, Edit } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ArticleEditor } from "./ArticleEditor";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { TTSPlayer } from "@/components/TTS/TTSPlayer";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from 'react-markdown';

interface Article {
  id: number | string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  category: string;
  isFavorite: boolean;
  isUserGenerated?: boolean;
}

export const ArticlesPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [defaultArticles] = useState<Article[]>([
    {
      id: 1,
      title: "控制你能控制的",
      excerpt: "斯多葛哲学的核心智慧：专注于你能控制的事情，接受你无法控制的事情。",
      content: `在斯多葛哲学中，最重要的原则之一就是明确区分什么是我们能够控制的，什么是我们无法控制的。

爱比克泰德说："有些事情在我们的控制之下，有些事情不在我们的控制之下。在我们控制之下的是我们的观点、追求、欲望、厌恶，简而言之，就是我们的行为。不在我们控制之下的是我们的身体、财产、名声、地位，简而言之，就是所有不是我们行为的事情。"

这个原则看似简单，但实践起来却需要持续的觉察和训练。当我们遇到挫折或困难时，我们经常会花费大量精力去担心那些我们无法控制的事情——比如他人的看法、未来的结果、过去的失误。

相反，斯多葛哲学教导我们将注意力转向我们真正能够影响的领域：我们的态度、我们的努力、我们的选择。这不是消极的接受，而是积极的专注——将有限的精力投入到能够产生真正影响的地方。

每天问自己：
- 今天遇到的挑战中，哪些是我能控制的？
- 我正在为哪些无法控制的事情而焦虑？
- 我可以如何调整我的关注点？

通过练习这种思维方式，我们可以获得内心的平静和真正的力量。`,
      readTime: "3 分钟",
      category: "核心原则",
      isFavorite: false
    },
    {
      id: 2,
      title: "逆境中的成长",
      excerpt: "困难和挑战不是障碍，而是成长和品格锻炼的机会。",
      content: `马可·奥勒留在《沉思录》中写道："障碍不能阻挡行动，成为行动的一部分；阻碍成为道路的一部分。"

这句话揭示了斯多葛哲学对困难的独特视角。我们通常将逆境视为不幸，希望避免痛苦和挫折。但是斯多葛哲学家认为，这些经历实际上是我们发展智慧、勇气和坚韧的珍贵机会。

想象一下肌肉的训练：没有阻力，肌肉就不会变强。同样，没有挑战，我们的品格也无法得到锻炼。每一次困难都是在考验我们的价值观、测试我们的原则，并给我们机会去实践我们所学到的智慧。

当我们面临困难时，可以问自己：
- 这个挑战可以教会我什么？
- 我可以如何运用斯多葛的原则来应对？
- 这个经历如何让我变得更强？

记住，我们无法选择发生在我们身上的事情，但我们永远可以选择如何回应。正是在这些选择中，我们塑造了自己的品格。

困难是暂时的，但我们从中获得的智慧和力量是永恒的。每一次逆境都是一次邀请，邀请我们成为更好的自己。`,
      readTime: "4 分钟",
      category: "实践指南",
      isFavorite: true
    },
    {
      id: 3,
      title: "当下的智慧",
      excerpt: "专注于当下这一刻，既不被过去束缚，也不为未来焦虑。",
      content: `马可·奥勒留提醒我们："专注于现在。过去已经不存在，未来尚未到来。你拥有的只有现在这一刻。"

在现代社会，我们经常被过去的遗憾和未来的焦虑所困扰。我们在心理上重复播放过去的失误，或者为可能永远不会发生的未来情况而担忧。这种心理状态不仅浪费了我们的精力，还剥夺了我们体验当下的能力。

斯多葛哲学教导我们，真正的生活发生在现在。此时此刻是我们唯一能够真正影响的时间。我们不能改变过去，也不能完全控制未来，但我们可以充分利用现在。

练习当下的觉察：
- 深呼吸，感受空气进入和离开你的身体
- 观察你周围的环境，注意你能看到、听到、感受到的事物
- 将注意力带回到你正在做的事情上
- 当思绪飘向过去或未来时，温和地将它们带回现在

这不意味着我们不应该从过去学习或为未来做计划。相反，当我们完全专注于现在时，我们的学习更深刻，我们的计划更明智。

当下是我们真正拥有力量的地方。在这里，我们可以选择我们的态度，决定我们的行动，塑造我们的品格。`,
      readTime: "3 分钟",
      category: "正念练习",
      isFavorite: false
    }
  ]);

  const articles = [...defaultArticles, ...userArticles];

  useEffect(() => {
    loadUserArticles();
  }, []);

  const loadUserArticles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedArticles = data?.map((article: any) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        readTime: article.read_time,
        category: article.category,
        isFavorite: article.is_favorite,
        isUserGenerated: true
      })) || [];

      setUserArticles(formattedArticles);
    } catch (error) {
      console.error('Error loading user articles:', error);
    }
  };

  const toggleFavorite = async (articleId: number | string) => {
    // Handle default articles
    if (typeof articleId === 'number') {
      const updatedDefaults = defaultArticles.map(article => 
        article.id === articleId 
          ? { ...article, isFavorite: !article.isFavorite }
          : article
      );
      return;
    }

    // Handle user articles
    try {
      const article = userArticles.find(a => a.id === articleId);
      if (!article) return;

      const { error } = await supabase
        .from('articles')
        .update({ is_favorite: !article.isFavorite })
        .eq('id', articleId);

      if (error) throw error;

      setUserArticles(prev => prev.map(a => 
        a.id === articleId 
          ? { ...a, isFavorite: !a.isFavorite }
          : a
      ));
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  if (showEditor) {
    return (
      <ArticleEditor
        onBack={() => {
          setShowEditor(false);
          setEditingArticle(null);
          loadUserArticles();
        }}
        editingArticle={editingArticle}
      />
    );
  }

  if (selectedArticle) {
    return (
      <div className="flex flex-col min-h-screen bg-background flow-bg">
        {/* Article Header */}
        <div className="pt-16 pb-6 px-6 border-b border-border/30 glass-dark">
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('back')}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock size={16} />
            <span>{selectedArticle.readTime}</span>
            <span>•</span>
            <span>{selectedArticle.category}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight font-serif">
            {selectedArticle.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(selectedArticle.id)}
              className={cn(
                "text-muted-foreground hover:text-foreground -ml-2",
                selectedArticle.isFavorite && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart 
                size={18} 
                className={cn(
                  "mr-2",
                  selectedArticle.isFavorite && "fill-current"
                )} 
              />
              {selectedArticle.isFavorite ? t('favorited') : t('favorite')}
            </Button>
          </div>
        </div>

        {/* TTS Player */}
        <div className="px-6 pt-4">
          <TTSPlayer text={selectedArticle.content} />
        </div>

        {/* Article Content */}
        <div className="flex-1 px-6 py-6">
          <div className="prose prose-lg max-w-none text-foreground">
            {selectedArticle.isUserGenerated ? (
              <div className="markdown-content font-serif">
                <ReactMarkdown>
                  {selectedArticle.content}
                </ReactMarkdown>
              </div>
            ) : (
              selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed font-serif text-lg">
                  {paragraph}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background flow-bg">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">
              {t('stoicWisdom')}
            </h1>
            <p className="text-muted-foreground">
              {t('ancientWisdomModernApplication')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCreateNew}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
            >
              <Plus size={16} className="mr-2" />
              New Article
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="px-6 flex-1">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Card 
              key={article.id}
              className="glass-dark border-0 shadow-lg hover:shadow-xl smooth-transition cursor-pointer active:scale-[0.98]"
              onClick={() => setSelectedArticle(article)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {article.isUserGenerated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditArticle(article);
                        }}
                        className="p-2 hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
                      >
                        <Edit size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(article.id);
                      }}
                      className={cn(
                        "p-2 hover:bg-secondary/20",
                        article.isFavorite && "text-red-400 hover:text-red-300"
                      )}
                    >
                      <Heart 
                        size={16} 
                        className={article.isFavorite ? "fill-current" : ""} 
                      />
                    </Button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight font-serif">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-primary mt-4 text-sm">
                  <BookOpen size={16} className="mr-2" />
                  <span className="font-medium">{t('readFullArticle')}</span>
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