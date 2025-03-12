'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { ArrowRight } from 'lucide-react';

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

export default function PublicFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    getUser();

    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              username
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching posts:', error);
          toast.error('Failed to load posts');
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 border rounded-md">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No posts have been created yet.</p>
        {currentUser && (
          <p className="mt-2">
            <Link href="/profile" className="text-primary hover:underline">
              Create your first post
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Posts</h2>
      
      {posts.map(post => (
        <div key={post.id} className="border rounded-lg p-6 space-y-3 bg-card hover:shadow-md transition-shadow">
          <div>
            <Link href={`/posts/${post.id}`}>
              <h3 className="font-semibold text-xl hover:text-primary transition-colors">{post.title}</h3>
            </Link>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-muted-foreground">
                By {post.profiles?.username || 'Unknown user'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <p className="whitespace-pre-wrap line-clamp-3">{post.content}</p>
          
          <div className="pt-2 flex justify-between items-center">
            <Link 
              href={`/posts/${post.id}`} 
              className="text-sm text-primary hover:underline flex items-center"
            >
              Read more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            
            {currentUser?.id === post.user_id && (
              <Link 
                href="/profile" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Edit in profile
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 