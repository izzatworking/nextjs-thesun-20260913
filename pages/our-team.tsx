import { GetStaticProps } from 'next';
import { WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import { getCategories } from '../lib/wordpress';
import { useState, useRef, useEffect } from 'react';

interface OurTeamProps {
  categories: WPCategory[];
}

interface Member {
  name: string;
  role: string;
  section: 'chief' | 'editors' | 'journalists' | 'digital';
  description: string;
  funFact: string;
  social: string;
  image: string;
}

const TEAM_MEMBERS: Member[] = [
  {
    name: 'Himanshu Bhatt',
    role: 'Chief Editor',
    image: '/images/team-sarah.jpg',
    section: 'chief',
    description: 'Visionary leader steering The Sun\'s editorial direction. 10+ years in journalism, previously at The Star and Malay Mail.',
    funFact: 'Can finish a 300-page novel in one sitting 📚',
    social: '@sarahamira',
  },
  {
    name: 'Azura Abbas',
    role: 'Assistant Editor',
    image: '/images/team-adam.jpg',
    section: 'editors',
    description: 'Wordsmith extraordinaire. Polishes raw stories into polished gems before they reach your screen.',
    funFact: 'Has a collection of 50+ vintage fountain pens 🖊️',
    social: '@adamrizal',
  },
  {
    name: 'Hashini Kavithri',
    role: 'Editor',
    image: '/images/team-maya.jpg',
    section: 'editors',
    description: 'Grammar guru with an eagle eye for detail. Nothing gets past her.',
    funFact: 'Once caught a typo in a major newspaper — at age 12 🕵️',
    social: '@mayanatasya',
  },
  {
    name: 'Surach ',
    role: 'Editor',
    image: '/images/team-maya.jpg',
    section: 'editors',
    description: 'Grammar guru with an eagle eye for detail. Nothing gets past her.',
    funFact: 'Once caught a typo in a major newspaper — at age 12 🕵️',
    social: '@mayanatasya',
  },
  {
    name: 'Qirana Nabila Mohd Rashidi',
    role: ' Journalist',
    image: '/images/qirana.jpeg',
    section: 'journalists',
    description: 'Digs deep to uncover stories that matter. Award-winning investigative reporter.',
    funFact: 'Has a sixth sense for finding hidden stories in data 📊',
    social: '@qirana.nabila',
  },
  {
    name: 'Nik Faiz Nik Ruzman',
    role: 'Reporter',
    image: '/images/nikfaiz.jpeg',
    section: 'journalists',
    description: 'On-the-ground reporter covering breaking news and human interest stories across Malaysia.',
    funFact: 'Knows every shortcut in KL like the back of his hand 🏍️',
    social: '@aisyahlim',
  },
   {
    name: 'Kirthinee Ramesh',
    role: 'Reporter',
    image: '/images/nikfaiz.jpeg',
    section: 'journalists',
    description: 'On-the-ground reporter covering breaking news and human interest stories across Malaysia.',
    funFact: 'Knows every shortcut in KL like the back of his hand 🏍️',
    social: '@aisyahlim',
  },
   {
    name: 'Harith Kamal',
    role: 'Reporter',
    image: '/images/nikfaiz.jpeg',
    section: 'journalists',
    description: 'On-the-ground reporter covering breaking news and human interest stories across Malaysia.',
    funFact: 'Knows every shortcut in KL like the back of his hand 🏍️',
    social: '@aisyahlim',
  },
  {
    name: 'Ashwin Kumar',
    role: ' Head Digital Content editor',
    image: '/images/team-kenji.jpg',
    section: 'digital',
    description: 'Full-stack developer who builds the digital experience you see on The Sun website.',
    funFact: 'Wrote his first line of code at 13 and never looked back 🤖',
    social: 'ashwin.kumar@thesundaily.com',
  },
  {
    name: 'Reena',
    role: ' Assistant Digital Content Editor',
    image: '/images/team-fara.jpg',
    section: 'digital',
    description: 'Social media wizard who makes news go viral. Manages The Sun\'s social presence across all platforms.',
    funFact: 'Can schedule a month of posts in one coffee-fueled afternoon ☕',
    social: '@farahaziqah',
  },
  {
    name: 'Rais Zulfahmi',
    role: 'Digital Content Producer',
    image: '/images/rais.jpeg',
    section: 'digital',
    description: 'Web uploader and content ops specialist. Makes sure every story goes live smoothly and on time.',
    funFact: 'Has never missed a deadline — not even once ⏰',
    social: '@rais.zulfahmi',
  },
   {
    name: 'Qalif Zuhair',
    role: 'Digital Content Producer',
    image: '/images/qalif.jpeg',
    section: 'digital',
    description: 'Web uploader and content ops specialist. Makes sure every story goes live smoothly and on time.',
    funFact: 'Has never missed a deadline — not even once ',
    social: '@qalif@thesundaily.com',
  },
  {
    name: 'Subashini',
    role: 'Digital Content Producer',
    image: '/images/rais.jpeg',
    section: 'digital',
    description: 'Web uploader and content ops specialist. Makes sure every story goes live smoothly and on time.',
    funFact: 'Has never missed a deadline — not even once ⏰',
    social: '@raiss',
  },
  {
    name: 'Thiviya Tharshino',
    role: 'Digital Content Producer',
    image: '/images/rais.jpeg',
    section: 'digital',
    description: 'Web uploader and content ops specialist. Makes sure every story goes live smoothly and on time.',
    funFact: 'Has never missed a deadline — not even once ⏰',
    social: '@raiss',
  },
  {
    name: 'Tamarai',
    role: 'Digital Content Producer',
    image: '/images/rais.jpeg',
    section: 'digital',
    description: 'web uploader optimist',
    funFact: 'old but gold⏰',
    social: 'tamarai@thesundaily.com',
  },
];

const SECTION_CONFIG: Record<string, { label: string; tag: string }> = {
  editors: { label: 'Editors', tag: 'The wordsmiths' },
  journalists: { label: 'Journalists', tag: 'On the ground' },
  digital: { label: 'Digital Team', tag: 'Tech & creative' },
};

function Avatar({ src, alt, size = 'md', className = '' }: { src: string; alt: string; size?: 'chief' | 'lg' | 'md'; className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  const sizes = {
    chief: 'w-56 h-56 sm:w-64 sm:h-64',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const borderSizes = {
    chief: 'border-4',
    lg: 'border-[3px]',
    md: 'border-2',
  };

  return (
    <div className={`${sizes[size]} rounded-full ${borderSizes[size]} border-yellow-300 overflow-hidden shrink-0 shadow-lg ${className}`}>
      {failed ? (
        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-yellow-600">{alt.charAt(0)}</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-lg text-lg"
        >
          ✕
        </button>
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 h-72 sm:h-auto shrink-0 bg-gray-100 overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                const p = t.parentElement;
                if (p) {
                  p.classList.add('flex', 'items-center', 'justify-center');
                  const span = document.createElement('span');
                  span.className = 'text-6xl text-gray-300 font-black';
                  span.textContent = member.name.charAt(0);
                  p.appendChild(span);
                }
              }}
            />
          </div>
          <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{member.name}</h2>
            <div className="inline-block px-5 py-1.5 rounded-full bg-gray-900 text-white text-sm font-semibold mb-5 w-fit">
              {member.role}
            </div>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              {member.description}
            </p>
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex items-center gap-4 text-base">
                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0">🎯</span>
                <span className="text-gray-500">{member.funFact}</span>
              </div>
              <div className="flex items-center gap-4 text-base">
                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0">🌐</span>
                <span className="text-gray-500">{member.social}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OurTeam({ categories }: OurTeamProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <Layout
      title="Our Team | The Sun Malaysia"
      description="Meet the team behind The Sun Malaysia"
      categories={categories}
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* Header */}
          <div className="relative text-center mb-20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-200/50 text-purple-500 text-xs font-semibold tracking-[0.15em] uppercase mb-5 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Our People
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.05]">
                The faces<br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">behind the stories</span>
              </h1>
            </div>
          </div>

          {/* Chief */}
          <div className="mb-24">
            <div className="flex flex-col items-center">
              {TEAM_MEMBERS.filter(m => m.section === 'chief').map((member) => (
                <button
                  key={member.name}
                  onClick={() => setSelectedMember(member)}
                  className="group text-center"
                >
                  <div className="relative mb-6">
                    <Avatar src={member.image} alt={member.name} size="chief" className="group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-gray-900 text-white text-base font-bold rounded-full shadow-lg whitespace-nowrap">
                      Editor-in-Chief
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">{member.name}</h2>
                  <span className="text-gray-400 text-base border-b border-dotted border-gray-300 group-hover:border-yellow-400 transition-colors">View full profile →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-16">
            {Object.entries(SECTION_CONFIG).map(([key, config]) => {
              const members = TEAM_MEMBERS.filter(m => m.section === key);
              return (
                <div key={key}>
                  <div className="mb-8">
                    <span className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.15em]">{config.tag}</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">{config.label}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
                    {members.map((member) => (
                      <button
                        key={member.name}
                        onClick={() => setSelectedMember(member)}
                        className="group text-left"
                      >
                        <div className="rounded-2xl bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-yellow-300 transition-all duration-300 p-7 sm:p-8">
                          <div className="flex items-center gap-5 sm:gap-6">
                            <Avatar src={member.image} alt={member.name} size="md" />
                            <div className="min-w-0">
                              <h3 className="text-gray-900 font-bold text-xl sm:text-2xl group-hover:text-yellow-600 transition-colors truncate">
                                {member.name}
                              </h3>
                              <p className="text-gray-400 text-base sm:text-lg truncate">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hiring */}
          <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white text-base font-semibold hover:bg-gray-800 transition-colors cursor-pointer tracking-wide">
              ✧ We&apos;re hiring — join the team ✧
            </div>
          </div>
        </div>
      </div>

      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories();

  return {
    props: {
      categories,
    },
  };
};
