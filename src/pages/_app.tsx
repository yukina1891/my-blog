import Layout from '@/components/common/Layout'
import "@/styles/globals.css";
import type { AppProps } from 'next/app'
import SEO from '../../next-seo.config';
import { DefaultSeo } from 'next-seo';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
