import type { StaticImageData } from 'next/image';
import a99logo from '@/assets/images/a99logo.png';
import ideallogo from '@/assets/images/ideal-logo.jpg';
import hibu from '@/assets/images/hibu-logo.png';
import upwork from '@/assets/images/upworklogo.jpg';

export interface CareerRole {
  start: number;
  end: number | 'Present';
  title: string;
  company: string;
  companyUrl: string;
  companyLabel: string;
  location: string;
  description: string;
  stacks: string[];
  logo: StaticImageData;
}

/** Career history, oldest first (the About page timeline reads it top to bottom). */
export const CAREER: CareerRole[] = [
  {
    start: 2012,
    end: 2013,
    title: 'Front-end Web Developer',
    company: 'Hibu / Yell Adworks',
    companyUrl: 'https://hibu.com/',
    companyLabel: 'hibu.com',
    location: 'Eastwood City, Philippines',
    description:
      'Converted high-fidelity PSD designs into pixel-perfect responsive HTML/CSS layouts. Performed cross-browser compatibility testing and developed lightweight custom PHP CMS modules.',
    stacks: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'jQuery', 'Photoshop'],
    logo: hibu,
  },
  {
    start: 2013,
    end: 2014,
    title: 'Software Engineer',
    company: 'Ideal International Education Corp',
    companyUrl: 'https://idealeducationhk.com/',
    companyLabel: 'idealeducationhk.com',
    location: 'Makati City, Philippines',
    description:
      'Engineered single-page PHP web platforms and dynamic learning modules. Maintained high availability for online education systems and converted marketing designs into responsive landing pages.',
    stacks: ['WordPress', 'JavaScript', 'PHP', 'jQuery', 'Figma'],
    logo: ideallogo,
  },
  {
    start: 2013,
    end: 'Present',
    title: 'Top-Rated Freelance Software Engineer',
    company: 'Upwork',
    companyUrl: 'https://www.upwork.com/freelancers/~0173d7d6f41ce01c95',
    companyLabel: 'Upwork profile',
    location: 'Global remote',
    description:
      'Top-Rated developer on Upwork specializing in React, Next.js, and custom WordPress systems with a 100% job success rate across US, UK, and European client projects.',
    stacks: ['React', 'Next.js', 'TypeScript', 'WordPress', 'Tailwind CSS', 'REST APIs'],
    logo: upwork,
  },
  {
    start: 2014,
    end: 'Present',
    title: 'Software Engineer',
    company: 'August99',
    companyUrl: 'https://august99.com/',
    companyLabel: 'august99.com',
    location: 'Ortigas Pasig, Philippines',
    description:
      'Expertise in WordPress architecture, custom theme and plugin creation, Bedrock/Sage frameworks, and modern React/Next.js client web applications. Emphasizes UI/UX precision, SEO performance optimization, accessibility compliance, and enterprise security measures.',
    stacks: ['WordPress', 'JavaScript', 'PHP', 'Bedrock', 'React', 'Next.js', 'Figma'],
    logo: a99logo,
  },
];

/** Current product work shown as the timeline's final "Today" stop. Permalinks point at case studies. */
export const CAREER_NOW = [
  { label: 'BuildForUser', note: 'SaaS for managing client sites at scale', permalink: 'buildforuser' },
  { label: 'MacManus portals', note: 'FCA-regulated asset finance platform', permalink: 'macmanus-portal' },
  { label: 'Blanc plugins', note: 'AI chatbot, lead CRM and schema plugins', href: '/plugins' },
];
