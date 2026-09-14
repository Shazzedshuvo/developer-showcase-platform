require('dotenv').config();
const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');
const Settings = require('./models/Settings');

const seedTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Team Seed...');

    // Update settings team details
    await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          teamName: 'Dont Worry',
          teamTagline: 'Elite Web Development, Wix Studio & CMS Specialization',
          teamDescription:
            'A high-performance digital team dedicated to crafting pixel-perfect, lightning-fast web solutions for forward-thinking brands and global clients.',
        },
      },
      { upsert: true, new: true }
    );

    const count = await TeamMember.countDocuments();
    if (count === 0) {
      await TeamMember.create([
        {
          name: 'Shazzed Shuvo',
          role: 'Founder & Lead CMS Specialist',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          bio: '5+ years specializing in Wix Studio, Squarespace, Webflow, and Full-Stack JavaScript architectures with 100+ delivered projects.',
          skills: ['Wix Studio', 'Squarespace', 'Webflow', 'React.js', 'Tailwind CSS', 'Node.js'],
          experience: '5+ Years',
          email: 'shazzedshuvo@gmail.com',
          socialLinks: {
            github: 'https://github.com/Shazzedshuvo',
            linkedin: 'https://linkedin.com',
            portfolio: 'https://shuvos-projects.vercel.app',
          },
          order: 1,
          isActive: true,
        },
        {
          name: 'Sarah Lin',
          role: 'Senior UI/UX Designer & Prototyper',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
          bio: 'Designing responsive design systems, high-converting checkout flows, and clean animations across modern web platforms.',
          skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Responsive Web', 'Micro-Interactions'],
          experience: '4+ Years',
          email: '',
          socialLinks: {
            linkedin: 'https://linkedin.com',
          },
          order: 2,
          isActive: true,
        },
        {
          name: 'Alex Rivera',
          role: 'Frontend & Animations Engineer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
          bio: 'Mastering Framer Motion, HTML5 Canvas 3D particle animations, and speed optimization for 100/100 Google Lighthouse scores.',
          skills: ['Three.js', 'Framer Motion', 'Canvas 3D', 'Next.js', 'SEO Optimization'],
          experience: '4+ Years',
          email: '',
          socialLinks: {
            github: 'https://github.com',
          },
          order: 3,
          isActive: true,
        },
      ]);
      console.log('Seeded 3 initial team members for Team: Dont Worry');
    } else {
      console.log(`Found ${count} existing team members in Atlas DB.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding team:', error);
    process.exit(1);
  }
};

seedTeam();
