// pages/posts/[slug].tsx - Redirect to category-based URL
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPost, getPosts, getCategoryById, getCategories, generatePostUrl, setCategoryCache } from '../../lib/wordpress';
import { WPPostWithMedia } from '../../types/wordpress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface PostRedirectProps {
  post: WPPostWithMedia | null;
  redirectUrl: string | null;
}

export default function PostRedirect({ post, redirectUrl }: PostRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (redirectUrl) {
      router.replace(redirectUrl);
    } else {
      // Fallback to home if post not found
      router.replace('/');
    }
  }, [redirectUrl, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to article...</p>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await getPosts(100);
    
    const paths = posts.map((post: WPPostWithMedia) => ({
      params: { slug: post.slug }
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let slug = params?.slug as string;
  
  // Clean up slug - remove any trailing slashes or extra characters
  if (slug) {
    slug = slug.replace(/\/+$/, ''); // Remove trailing slashes
    slug = slug.replace(/\/+/g, '/'); // Replace multiple slashes with single
  }

  try {
    const [post, categories] = await Promise.all([
      getPost(slug),
      getCategories(),
    ]);
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    setCategoryCache(categories);

    // Generate the correct category-based URL
    const redirectUrl = generatePostUrl(post, categories);
    
    return {
      props: {
        post,
        redirectUrl,
      },
    };
  } catch (error) {
    console.error('Error fetching post for redirect:', error);
    return {
      notFound: true,
    };
  }
};