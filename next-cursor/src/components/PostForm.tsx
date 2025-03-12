'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PostFormProps {
  userId?: string;
  post?: {
    id: string;
    title: string;
    content: string;
  };
  onSuccess?: () => void;
}

export default function PostForm({ userId, post, onSuccess }: PostFormProps) {
  const isEditing = !!post;
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && post) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq('id', post.id)
          .eq('user_id', userId);
          
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Post updated successfully');
          if (onSuccess) onSuccess();
        }
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([{ 
            title, 
            content, 
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Post created successfully');
          // Reset form
          setTitle('');
          setContent('');
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          rows={6}
          className="mt-1"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading 
          ? (isEditing ? 'Updating...' : 'Creating...') 
          : (isEditing ? 'Update Post' : 'Create Post')}
      </Button>
    </form>
  );
} 