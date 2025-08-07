import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';
import Layout from '@/components/Layout';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <Layout>
                <Component {...pageProps} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
            </Layout>
        </ApolloProvider>
    );
}
