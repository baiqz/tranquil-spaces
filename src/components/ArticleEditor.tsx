import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Upload, Image } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface ArticleEditorProps {
  onBack: () => void;
  editingArticle?: any;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ onBack, editingArticle }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [excerpt, setExcerpt] = useState(editingArticle?.excerpt || '');
  const [content, setContent] = useState(editingArticle?.content || '');
  const [category, setCategory] = useState(editingArticle?.category || 'uncategorized');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const categories = [
    { value: 'uncategorized', label: t('uncategorized') },
    { value: 'core-principles', label: t('core-principles') },
    { value: 'practice-guide', label: t('practice-guide') },
    { value: 'mindfulness', label: t('mindfulness') },
    { value: 'philosophy', label: t('philosophy') }
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      const imageMarkdown = `![${file.name}](${data.publicUrl})`;
      setContent(prev => prev + '\n\n' + imageMarkdown);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} 分钟`;
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save articles');
        return;
      }

      const articleData = {
        title: title.trim(),
        excerpt: excerpt.trim() || content.substring(0, 150) + '...',
        content: content.trim(),
        category,
        read_time: calculateReadTime(content),
        user_id: user.id,
        is_published: true
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);
        
        if (error) throw error;
        toast.success('Article updated successfully');
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);
        
        if (error) throw error;
        toast.success('Article published successfully');
      }

      onBack();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background flow-bg">
      {/* Header */}
      <div className="pt-16 pb-6 px-6 border-b border-border/30 glass-dark">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('back')}
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="border-border/30"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {editingArticle ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground font-serif">
          {editingArticle ? 'Edit Article' : 'Create New Article'}
        </h1>
      </div>

      <div className="flex-1 px-6 py-6">
        {isPreview ? (
          <Card className="glass-dark border-0 shadow-lg">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-4 font-serif">
                {title || 'Article Title'}
              </h1>
              <div className="prose prose-lg max-w-none text-foreground markdown-content">
                <ReactMarkdown>
                  {content || 'Article content will appear here...'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Article Details */}
            <Card className="glass-dark border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground font-serif">Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title..."
                    className="mt-1 bg-background/50 border-border/30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt" className="text-foreground">Excerpt (Optional)</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the article..."
                    className="mt-1 bg-background/50 border-border/30 min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-foreground">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="glass-dark border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground font-serif">Content (Markdown)</CardTitle>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={imageUploading}
                      className="border-border/30"
                    >
                      {imageUploading ? (
                        <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                      ) : (
                        <Image size={16} />
                      )}
                      <span className="ml-2">Upload Image</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article in markdown format...

Example:
# Heading
## Subheading
**Bold text**
*Italic text*
- List item
[Link](url)
![Image](url)"
                  className="min-h-[400px] bg-background/50 border-border/30 font-mono"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};