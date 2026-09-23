// pages/post/[slug].tsx - Redirect from singular "post" to the category-based URL
import { GetServerSideProps } from 'next';
import { getPost, getCategories, generatePostUrl, setCategoryCache } from '../../lib/wordpress';

export default function PostRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to article...</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');

  const rawSlug = context.params?.slug;
  let slug = String(Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || '';

  // Clean up slug - remove any trailing slashes or extra characters
  if (slug) {
    slug = slug.replace(/\/+$/, '');
    slug = slug.replace(/\/+/g, '/');
  }

  try {
    const [post, categories] = await Promise.all([getPost(slug), getCategories()]);

    if (!post) {
      return { notFound: true };
    }

    setCategoryCache(categories);

    const redirectUrl = generatePostUrl(post, categories);

    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error fetching post for /post/[slug] redirect:', error);
    return { notFound: true };
  }
};
