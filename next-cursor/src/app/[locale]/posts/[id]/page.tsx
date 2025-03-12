'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    username: string;
  };
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!params.id) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              username
            )
          `)
          .eq('id', params.id)
          .single();
          
        if (error) {
          console.error('Error fetching post:', error);
          toast.error('Failed to load post');
          router.push('/');
        } else if (data) {
          setPost(data);
        } else {
          toast.error('Post not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id, router, supabase]);
  
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">Post not found</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Link>
      </Button>
      
      <article className="bg-card border rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex justify-between items-center mb-6 text-sm text-muted-foreground">
          <p>By {post.profiles?.username || 'Unknown user'}</p>
          <p>{new Date(post.created_at).toLocaleString()}</p>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </article>
    </div>
  );
} 