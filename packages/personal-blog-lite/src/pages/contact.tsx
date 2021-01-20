import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Contact from '../containers/contact';

type ContactPageProps = {};

const ContactPage: React.FunctionComponent<ContactPageProps> = (props) => {
  return (
    <Layout>
      <SEO
        title='Contact '
        description='Interested in having me speak at your event? Create technical content? Have a suggestion for content? Maybe just a general question? I would love to hear from you!'
      />

      <Contact />
    </Layout>
  );
};

export default ContactPage;
