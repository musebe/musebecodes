import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import About from '../containers/about';

type AboutPageProps = {};

const AboutPage: React.FunctionComponent<AboutPageProps> = (props) => {
  return (
    <Layout>
      <SEO
        title='About Me'
        description='Am a Fullstack Web developer passionate about building web accessible applications.I am passionate about building developer inclusive communities that support and share knowledge on existing and upcoming technological trends. I am also a Media Developer Expert at cloudinary where i specialize in web accessibility and An Auth0 Ambassador that creates content around web security.  Using this platform, I will be able to share the little knowledge and snippets i acquire in my line of duty. '
      />

      <About />
    </Layout>
  );
};

export default AboutPage;
