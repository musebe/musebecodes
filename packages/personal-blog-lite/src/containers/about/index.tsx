import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import SocialProfile from '../../components/social-profile/social-profile';
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoLinkedin,
} from 'react-icons/io';
import {
  AboutWrapper,
  AboutImage,
  AboutPageTitle,
  AboutDetails,
  SocialProfiles,
} from './style';

const SocialLinks = [
  {
    icon: <IoLogoFacebook />,
    url: 'https://www.facebook.com/redqinc/',
    tooltip: 'Facebook',
  },
  {
    icon: <IoLogoInstagram />,
    url: 'https://www.instagram.com/redqinc/',
    tooltip: 'Instagram',
  },
  {
    icon: <IoLogoTwitter />,
    url: 'https://twitter.com/redqinc',
    tooltip: 'Twitter',
  },
  {
    icon: <IoLogoLinkedin />,
    url: 'https://www.linkedin.com/company/redqinc/',
    tooltip: 'Linked In',
  },
];

interface AboutProps {}

const About: React.FunctionComponent<AboutProps> = () => {
  const Data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/about.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 1770, quality: 90) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      site {
        siteMetadata {
          author
          about
        }
      }
    }
  `);

  return (
    <AboutWrapper>
      <AboutDetails>
        <h2>Hey there, what’s up?</h2>
        <p>
          Am a Fullstack Web developer passionate about building web accessible
          applications.I am also passionate about building developer inclusive
          communities that support and share knowledge on existing and upcoming
          technological trends. In my line of duty, I work with Cloudinary as Media Developer Expert
          where i specialize in web accessibility.I'm also an Auth0 Ambassador that
          creates content around web security. Using this platform, I will be
          able to share the little knowledge and snippets i acquire in my line
          of duty.
        </p>

        <SocialProfiles>
          <SocialProfile items={SocialLinks} />
        </SocialProfiles>
      </AboutDetails>
    </AboutWrapper>
  );
};

export default About;
