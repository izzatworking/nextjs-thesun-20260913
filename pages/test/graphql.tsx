import { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import GraphQLTest from '../../components/test/GraphQLTest';
import { testGraphQLConnection } from '../../lib/graphql';

interface GraphQLTestPageProps {
  connectionTest: {
    success: boolean;
    message: string;
  };
}

export default function GraphQLTestPage({ connectionTest }: GraphQLTestPageProps) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">GraphQL Integration Test</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Server-side Test Result:</h2>
          <div className={`p-4 rounded-lg ${connectionTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">{connectionTest.message}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Client-side Test:</h2>
          <GraphQLTest />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Next Steps:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Install WPGraphQL plugin on WordPress</li>
            <li>Verify GraphQL endpoint is accessible</li>
            <li>Check environment variables</li>
            <li>Test with actual queries</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const connectionTest = await testGraphQLConnection();
  
  return {
    props: {
      connectionTest,
    },
  };
};