require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Project = require('./models/Project');
const Review = require('./models/Review');

const categoriesData = [
  { name: 'Wix', slug: 'wix' },
  { name: 'Squarespace', slug: 'squarespace' },
  { name: 'WordPress', slug: 'wordpress' },
  { name: 'Webflow', slug: 'webflow' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'Kajabi', slug: 'kajabi' },
  { name: 'Custom Code', slug: 'custom-code' },
];

const getScreenshotUrl = (url) => {
  // Microlink high-quality live screenshot endpoint
  return `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
};

const rawProjects = [
  // ── Wix & Squarespace ──
  {
    title: 'The Library Company',
    categorySlug: 'squarespace',
    description: 'A sophisticated and minimalist Squarespace website for a professional consultancy and services firm featuring clean typography and responsive layout.',
    demoUrl: 'https://www.thelibrary.company/',
    isFeatured: true,
  },
  {
    title: 'Percenteum Business Consultation',
    categorySlug: 'wix',
    description: 'Modern corporate Wix website built for a top-tier business consultation firm with interactive service modules and lead generation funnel.',
    demoUrl: 'https://www.percenteum.com/',
    isFeatured: true,
  },
  {
    title: 'Cena Impact Consulting',
    categorySlug: 'squarespace',
    description: 'High-impact advisory and consulting website designed on Squarespace with elegant aesthetic, case studies, and appointment booking integration.',
    demoUrl: 'https://www.cenaimpact.com/',
    isFeatured: true,
  },
  {
    title: '360 Management Switzerland',
    categorySlug: 'wix',
    description: 'Executive professional services and company management platform built on Wix with bilingual support and corporate identity styling.',
    demoUrl: 'https://www.360management.ch/',
    isFeatured: false,
  },
  {
    title: 'MyPath ABA Autism Child Care',
    categorySlug: 'squarespace',
    description: 'Compassionate and accessible healthcare website for pediatric autism care, featuring resource hubs, HIPAA compliant forms, and warm visuals.',
    demoUrl: 'https://www.mypathaba.com/',
    isFeatured: true,
  },
  {
    title: 'Talbot Management Veterans Housing',
    categorySlug: 'wix',
    description: 'Community housing initiative website for veterans with program details, donation integrations, and intake inquiry forms on Wix.',
    demoUrl: 'https://www.talbotmanagement.info/',
    isFeatured: false,
  },
  {
    title: 'Agape Love Home Care Service',
    categorySlug: 'wix',
    description: 'Elderly and home healthcare services portal on Wix with service catalogues, caregiver trust badges, and online consultation bookings.',
    demoUrl: 'https://www.agapelovehc.com/',
    isFeatured: false,
  },
  {
    title: 'Beagle Caper Healthcare Service',
    categorySlug: 'squarespace',
    description: 'Modern healthcare and wellness digital experience on Squarespace with patient portal links and responsive mobile navigation.',
    demoUrl: 'https://beagle-caper-yknm.squarespace.com/',
    isFeatured: false,
  },
  {
    title: 'DM Health Partners',
    categorySlug: 'squarespace',
    description: 'Premier medical partnership and healthcare clinic website showcasing specialized physician teams and treatment modalities.',
    demoUrl: 'https://www.dmhealthpartners.com/',
    isFeatured: true,
  },
  {
    title: 'Beagle Orb Construction',
    categorySlug: 'squarespace',
    description: 'Architectural construction and commercial remodeling showcase built on Squarespace with interactive project portfolio galleries.',
    demoUrl: 'https://beagle-orb-edgl.squarespace.com/',
    isFeatured: false,
  },
  {
    title: 'Home Fixerz Remodeling',
    categorySlug: 'squarespace',
    description: 'Residential home renovation and remodeling contractor website on Squarespace with before/after comparisons and instant quote requests.',
    demoUrl: 'https://www.homefixerz.com/',
    isFeatured: false,
  },
  {
    title: 'Elephant Interior Home Design',
    categorySlug: 'squarespace',
    description: 'Luxury interior styling and architectural planning showcase with aesthetic moodboards and curated material galleries on Squarespace.',
    demoUrl: 'https://elephant-raspberry-j65f.squarespace.com/?password=121',
    isFeatured: false,
  },
  {
    title: 'Seven Thirty One Charity & E-commerce',
    categorySlug: 'wix',
    description: 'Purpose-driven non-profit e-commerce website on Wix combining merchandise sales with humanitarian fundraising campaigns.',
    demoUrl: 'https://www.seventhirtyone.love/',
    isFeatured: true,
  },
  {
    title: 'Culture Kasa Sports & Apparel',
    categorySlug: 'wix',
    description: 'Dynamic sports community and streetwear brand portal on Wix with interactive community events and catalog.',
    demoUrl: 'https://culturekasa.wixsite.com/monsite',
    isFeatured: false,
  },
  {
    title: 'Midgard Metal Works Handmade Knives',
    categorySlug: 'wix',
    description: 'Artisanal custom cutlery and bladesmith portfolio on Wix with custom product showcases, knife specifications, and commission inquiries.',
    demoUrl: 'https://www.midgardmetalworks.net/',
    isFeatured: true,
  },
  {
    title: '8-Media Digital Marketing Agency',
    categorySlug: 'wix',
    description: 'Cutting-edge digital marketing agency site crafted with Wix Studio featuring fluid micro-interactions, dark mode aesthetic, and case studies.',
    demoUrl: 'https://yakuptasdemir.wixstudio.com/8-media',
    isFeatured: true,
  },
  {
    title: 'Angie Marie Wedding Photography',
    categorySlug: 'squarespace',
    description: 'High-end wedding photography portfolio on Squarespace with full-bleed image grids, storytelling blogs, and client booking funnels.',
    demoUrl: 'http://www.angiemariephotography.net/',
    isFeatured: true,
  },
  {
    title: 'Indigo Plane Wedding & Events',
    categorySlug: 'squarespace',
    description: 'Bespoke event planning and luxury wedding showcase on Squarespace highlighting curated vendor networks and romantic gallery aesthetics.',
    demoUrl: 'https://indigo-plane-z7d7.squarespace.com/',
    isFeatured: false,
  },
  {
    title: 'Next Home BA Real Estate',
    categorySlug: 'squarespace',
    description: 'Australian residential real estate agency website on Squarespace with property search listings, neighborhood guides, and valuation forms.',
    demoUrl: 'https://www.nexthomeba.com.au/',
    isFeatured: true,
  },
  {
    title: 'Dynamic Recovery & Weight Loss',
    categorySlug: 'wix',
    description: 'Holistic wellness and physical therapy clinic on Wix featuring patient transformations, appointment booking, and treatment roadmaps.',
    demoUrl: 'https://www.dynamicrecoveryrestore.com/',
    isFeatured: false,
  },
  {
    title: 'Care Alliance Collective',
    categorySlug: 'squarespace',
    description: 'Community care and healthcare advocacy organization on Squarespace with volunteer portal and initiative dashboards.',
    demoUrl: 'https://www.carealliancecollective.com/',
    isFeatured: false,
  },

  // ── WordPress / Custom Sites ──
  {
    title: 'Mot Juan Demo Experience',
    categorySlug: 'wordpress',
    description: 'High performance custom WordPress theme development with responsive UI components and optimized Core Web Vitals.',
    demoUrl: 'https://motjuandemo.wizardswp.com/',
    isFeatured: false,
  },
  {
    title: 'Diaspora Parcel Logistics',
    categorySlug: 'wordpress',
    description: 'Global package forwarding and logistics tracking platform developed with custom WordPress post types and quote calculators.',
    demoUrl: 'https://diasporaparcel.wizardswp.com/',
    isFeatured: false,
  },
  {
    title: 'Guidry Law Firm Legal Services',
    categorySlug: 'wordpress',
    description: 'Authoritative law practice website on WordPress with practice area directories, attorney profiles, and secure client intake.',
    demoUrl: 'https://guidrylaw.wizardswp.com/',
    isFeatured: true,
  },
  {
    title: 'Peak Laundry Commercial Services',
    categorySlug: 'wordpress',
    description: 'Modern laundromat and commercial linen service website featuring dynamic pricing tiers and pickup scheduling on WordPress.',
    demoUrl: 'https://peaklaundry.wizardswp.com/',
    isFeatured: false,
  },
  {
    title: 'DFCC Community Church',
    categorySlug: 'wordpress',
    description: 'Faith community and ministry website featuring sermon video archives, livestream links, and community donation portal on WordPress.',
    demoUrl: 'https://dfccchurch.wizardswp.com/',
    isFeatured: false,
  },
  {
    title: 'SV Alpha Digital Hub',
    categorySlug: 'wordpress',
    description: 'Corporate solutions platform developed with Elementor Pro and custom CSS animations for lightning fast page speed.',
    demoUrl: 'https://iansiddiqi253.svalphawp.com/',
    isFeatured: false,
  },
  {
    title: '1920 Lounge Restaurant & Bar',
    categorySlug: 'wordpress',
    description: 'Upscale vintage restaurant and cocktail lounge website with interactive digital menus, table reservation widget, and event calendar.',
    demoUrl: 'https://1920lounge.com/home-new/',
    isFeatured: true,
  },

  // ── Business / Company Websites ──
  {
    title: 'No Defeat Co Fitness Lifestyle',
    categorySlug: 'custom-code',
    description: 'Athletic apparel and high performance lifestyle platform built with custom modern web architecture and sleek animations.',
    demoUrl: 'https://www.nodefeat.co/',
    isFeatured: true,
  },
  {
    title: 'Enter Into Calm Meditation & Wellness',
    categorySlug: 'custom-code',
    description: 'Soothing digital sanctuary for mindfulness courses, sound bath bookings, and guided wellness journeys.',
    demoUrl: 'https://www.enterintocalm.com/',
    isFeatured: false,
  },
  {
    title: "Joey's HR Lounge",
    categorySlug: 'custom-code',
    description: 'Human resources consulting hub and talent acquisition advisory portal with career resources and consultation scheduling.',
    demoUrl: 'https://www.joeyshrlounge.com/',
    isFeatured: false,
  },
  {
    title: 'Long Dog Lawn Care Services',
    categorySlug: 'wordpress',
    description: 'Local landscaping and lawn maintenance business website with zip-code service checking and automated estimate forms.',
    demoUrl: 'https://www.longdoglawncarenwa.com/',
    isFeatured: false,
  },
  {
    title: 'Milltown Dental Family Practice',
    categorySlug: 'wordpress',
    description: 'Modern family dental clinic website with online patient registration, emergency dental hotlines, and insurance guides.',
    demoUrl: 'https://www.milltowndental.us/',
    isFeatured: true,
  },
  {
    title: 'VMC Pharmacy & Wellness',
    categorySlug: 'wordpress',
    description: 'Independent pharmacy website with digital prescription refill requests, vaccination schedules, and health blog.',
    demoUrl: 'https://www.vmcpharmacy.com/',
    isFeatured: false,
  },
  {
    title: 'Repurpose Solar Clean Energy',
    categorySlug: 'wordpress',
    description: 'Sustainable solar recycling and renewable energy solutions provider with project carbon offset calculators.',
    demoUrl: 'https://www.repurposesolar.net/',
    isFeatured: true,
  },
  {
    title: 'Jesus Saves Property Restoration',
    categorySlug: 'wordpress',
    description: 'Emergency disaster restoration and water damage repair company with 24/7 dispatch hotline and insurance assistance pages.',
    demoUrl: 'https://jesussavesrestoration.com/',
    isFeatured: false,
  },
  {
    title: 'Spurmart Germany E-Commerce',
    categorySlug: 'shopify',
    description: 'German retail and product marketplace with multi-currency checkout, localized shipping integrations, and clean category filtering.',
    demoUrl: 'https://www.spurmart.de/',
    isFeatured: false,
  },
  {
    title: 'Stain Steamerz Cleaning Services',
    categorySlug: 'wordpress',
    description: 'Carpet, upholstery, and commercial steam cleaning company website with instant quote builder and customer review feeds.',
    demoUrl: 'https://stainsteamerz.com/',
    isFeatured: false,
  },
  {
    title: 'Next Phase Recovery Clinic',
    categorySlug: 'wordpress',
    description: 'Addiction recovery and mental health rehabilitation center website with compassionate admissions workflow and insurance verification.',
    demoUrl: 'https://nextphaserecovery.org/',
    isFeatured: true,
  },
  {
    title: 'Clean Dip Pool Maintenance',
    categorySlug: 'wordpress',
    description: 'Residential and commercial pool sanitation service website with monthly service subscription options.',
    demoUrl: 'https://cleandippool.com/',
    isFeatured: false,
  },
  {
    title: 'Moving Force Freight & Logistics',
    categorySlug: 'custom-code',
    description: 'Tech-enabled nationwide trucking and supply chain operations platform with shipment tracking integrations.',
    demoUrl: 'https://movingforce.io/',
    isFeatured: true,
  },
  {
    title: 'Musclinity Strength & Nutrition',
    categorySlug: 'custom-code',
    description: 'Bodybuilding nutrition and personal training portal with macro calculators and custom workout programs.',
    demoUrl: 'https://musclinity.com/',
    isFeatured: false,
  },
  {
    title: 'Chaat Corner Authentic Indian Dining',
    categorySlug: 'wordpress',
    description: 'Vibrant Melbourne Indian street food restaurant website with online takeaway ordering and catering inquiry forms.',
    demoUrl: 'https://chaatcorner.com.au/',
    isFeatured: false,
  },
  {
    title: 'Deja Brew Coffee & Bakery',
    categorySlug: 'wordpress',
    description: 'Artisanal coffee roaster and bakery website with weekly roast subscriptions, catering menus, and cozy cafe vibes.',
    demoUrl: 'https://dejabrewnh.com/',
    isFeatured: false,
  },
  {
    title: 'Legg Chiropractic Wellness Center',
    categorySlug: 'wordpress',
    description: 'Spinal health and chiropractic clinic website with interactive anatomy guides and new patient appointment scheduler.',
    demoUrl: 'https://www.leggchiropractic.com/',
    isFeatured: false,
  },
  {
    title: 'Clause & Effect Legal Group UK',
    categorySlug: 'wordpress',
    description: 'London corporate law and contractual advisory firm website with whitepapers, insights hub, and partner profiles.',
    demoUrl: 'https://www.clauseandeffectgroup.co.uk/',
    isFeatured: true,
  },
  {
    title: 'Lab T Creative Technology',
    categorySlug: 'custom-code',
    description: 'Future-forward creative technology studio showcase with interactive canvas elements and experimental UI.',
    demoUrl: 'https://www.labt.company/',
    isFeatured: true,
  },
  {
    title: 'Haidar Thobes Islamic Couture',
    categorySlug: 'shopify',
    description: 'Luxury Arabian men couture and traditional thobe boutique on Shopify with custom sizing charts and worldwide courier delivery.',
    demoUrl: 'https://www.haidarthobes.com/',
    isFeatured: true,
  },
  {
    title: 'Med Lounge San Ramon Medical Spa',
    categorySlug: 'wordpress',
    description: 'Aesthetic medical spa and laser clinic featuring injectable treatments, VIP memberships, and before/after galleries.',
    demoUrl: 'https://medloungesanramon.com/',
    isFeatured: true,
  },
  {
    title: 'The Heights District Commercial Real Estate',
    categorySlug: 'wordpress',
    description: 'Urban master-planned commercial and mixed-use real estate development website with interactive leasing floorplans.',
    demoUrl: 'https://www.theheightsdistrict.com/',
    isFeatured: true,
  },
  {
    title: 'Sun Click USA Digital Solutions',
    categorySlug: 'wordpress',
    description: 'B2B technology consultancy and digital growth agency website with service blueprints and case study archives.',
    demoUrl: 'https://www.sunclickusa.com/',
    isFeatured: false,
  },
  {
    title: 'Tanweer US Global Trading',
    categorySlug: 'wordpress',
    description: 'International trade, import-export, and commodity distribution corporate website with global operations map.',
    demoUrl: 'https://tanweerus.com/',
    isFeatured: false,
  },
  {
    title: "Freedmen's Financial Advisory",
    categorySlug: 'wordpress',
    description: 'Wealth management and retirement planning boutique firm with financial planning calculators and fiduciary credentials.',
    demoUrl: 'https://freedmensfinancial.com/',
    isFeatured: true,
  },
  {
    title: 'Elysium Grill Steakhouse & Wine',
    categorySlug: 'wordpress',
    description: 'Fine dining steakhouse website with seasonal gourmet menu displays, chef specials, and OpenTable reservation integration.',
    demoUrl: 'https://elysiumgrill.com/',
    isFeatured: false,
  },
  {
    title: 'Curated Quarters Interior Architecture',
    categorySlug: 'wordpress',
    description: 'Bespoke residential interior architecture and staging studio featuring immersive full-width project visual essays.',
    demoUrl: 'https://curatedquarters.com/',
    isFeatured: false,
  },
  {
    title: 'Ideal Land Singapore Real Estate',
    categorySlug: 'wordpress',
    description: 'Singapore premier landed property and luxury condo investment portal with real-time property listings.',
    demoUrl: 'https://idealland.com.sg/',
    isFeatured: true,
  },
  {
    title: 'Adele Hey Contemporary Art',
    categorySlug: 'custom-code',
    description: 'Visual artist portfolio and exhibition archive with high-resolution canvas zooms and private collector viewing rooms.',
    demoUrl: 'https://adeleheyart.com/',
    isFeatured: false,
  },
  {
    title: "Celia's Reserve Luxury Hospitality",
    categorySlug: 'wordpress',
    description: 'Private estate and luxury boutique retreat experience with curated guest packages, virtual tours, and VIP concierge.',
    demoUrl: 'https://www.celiasreserve.com/home-new',
    isFeatured: true,
  },
  {
    title: 'Nested Home Watch Property Care',
    categorySlug: 'wordpress',
    description: 'Accredited absentee homeowner and luxury seasonal property surveillance service website with client dashboard portal.',
    demoUrl: 'https://www.nestedhomewatch.com/',
    isFeatured: false,
  },
  {
    title: 'Datanova Sweden IT Solutions',
    categorySlug: 'custom-code',
    description: 'Scandinavian cloud infrastructure, cybersecurity, and enterprise IT support company portal with live support desk.',
    demoUrl: 'https://datanova.se/',
    isFeatured: true,
  },
  {
    title: 'Flex Fume Extraction & Industrial Tech',
    categorySlug: 'custom-code',
    description: 'Industrial air filtration and clean factory ventilation machinery catalog with technical PDF specification downloads.',
    demoUrl: 'https://flexfume.com',
    isFeatured: false,
  },

  // ── Kajabi Websites ──
  {
    title: 'Yannick Magee Executive Coaching',
    categorySlug: 'kajabi',
    description: 'High performance leadership coaching and digital masterclass membership portal built on Kajabi with video streaming.',
    demoUrl: 'https://yannick-magee.mykajabi.com/',
    isFeatured: true,
  },
  {
    title: 'Carol Scott McHale Education Hub',
    categorySlug: 'kajabi',
    description: 'Professional development academy and certification platform on Kajabi with quiz modules and community discussions.',
    demoUrl: 'https://carol-scott-mchale-scott-mchale.mykajabi.com/',
    isFeatured: false,
  },
  {
    title: 'Relationship Clarity by Callie Sorensen',
    categorySlug: 'kajabi',
    description: 'Transformational relationship coaching course portal on Kajabi featuring member workbooks, audio modules, and community forum.',
    demoUrl: 'https://calliesorensen.mykajabi.com/relationshipclarity',
    isFeatured: true,
  },

  // ── Shopify Websites ──
  {
    title: 'LOVF Contemporary Fashion Store',
    categorySlug: 'shopify',
    description: 'Chic women fashion and jewelry store on Shopify with sticky add-to-cart, currency conversion, and Instagram lookbook shop.',
    demoUrl: 'https://lovf-2.myshopify.com/',
    isFeatured: true,
  },

  // ── Webflow Websites ──
  {
    title: 'Kimonix AI Merchandising Platform',
    categorySlug: 'webflow',
    description: 'High-converting SaaS product marketing site built in Webflow with interactive product tours, ROI calculator, and CMS blog.',
    demoUrl: 'https://kimonix-staging.webflow.io/',
    isFeatured: true,
  },
  {
    title: 'Sarah Creative Portfolio',
    categorySlug: 'webflow',
    description: 'Editorial design and digital art direction portfolio created in Webflow with fluid page transitions and custom typography.',
    demoUrl: 'https://sarah-a5b331.webflow.io/',
    isFeatured: true,
  },
  {
    title: "Taylor's Hostel & Travel Co",
    categorySlug: 'webflow',
    description: 'Vibrant boutique youth hostel and traveler social hub built on Webflow with room availability calendars and local city guides.',
    demoUrl: 'https://taylorshostel.webflow.io/',
    isFeatured: true,
  },
  {
    title: 'Solid Seven Digital Agency',
    categorySlug: 'webflow',
    description: 'Branding and modern UI/UX design agency showcase in Webflow with 3D interactions and smooth scroll mechanics.',
    demoUrl: 'https://solid-seven.webflow.io/',
    isFeatured: true,
  },

  // ── Squarespace Websites ──
  {
    title: 'Violet Crimson Creative Collective',
    categorySlug: 'squarespace',
    description: 'Artistic media and editorial magazine on Squarespace featuring storytelling photography and curated lifestyle articles.',
    demoUrl: 'https://violet-crimson-ye9m.squarespace.com/',
    isFeatured: false,
  },
  {
    title: 'Dog Oval Pet Hotel & Grooming',
    categorySlug: 'squarespace',
    description: 'Luxury dog boarding, daycare, and canine wellness retreat on Squarespace with web camera access and appointment booking.',
    demoUrl: 'https://dog-oval-nfrl.squarespace.com/?password=121',
    isFeatured: false,
  },

  // ── Other / Custom / Global Websites ──
  {
    title: 'Atalaia Gold Mining & Investment',
    categorySlug: 'custom-code',
    description: 'Precious metals investment, gold mining exploration, and investor relations portal with real-time financial reporting.',
    demoUrl: 'https://atalaiagold.com/',
    isFeatured: true,
  },
  {
    title: 'Afrocentric AI Intelligence Platform',
    categorySlug: 'custom-code',
    description: 'Cutting-edge artificial intelligence and LLM research initiative celebrating Pan-African tech innovation and cultural computing.',
    demoUrl: 'https://afrocentric.ai/',
    isFeatured: true,
  },
  {
    title: 'Dark Goldenrod Leopard Studio',
    categorySlug: 'custom-code',
    description: 'High performance hosting and bespoke web development showcase with optimized server response times.',
    demoUrl: 'https://darkgoldenrod-leopard-931422.hostingersite.com/',
    isFeatured: false,
  },
  {
    title: 'Hair Fairy Luxury Hair Extensions',
    categorySlug: 'shopify',
    description: 'Luxury salon grade human hair extensions e-commerce boutique with color match quiz and stylist wholesale portal.',
    demoUrl: 'https://www.hairfairyextensions.com/',
    isFeatured: true,
  },
  {
    title: 'Neha Within Holistic Healing',
    categorySlug: 'squarespace',
    description: 'Mind-body transformation, breathwork retreats, and energy healing portal with digital sound healing downloads.',
    demoUrl: 'https://www.nehawithin.com/',
    isFeatured: false,
  },
  {
    title: 'We Are One Clan Global Community',
    categorySlug: 'custom-code',
    description: 'Global humanitarian alliance and decentralized cultural community uniting innovators and philanthropists worldwide.',
    demoUrl: 'https://www.weareoneclan.com/',
    isFeatured: true,
    description: 'Swiss precision engineering, technical textile solutions, and enterprise industrial manufacturing corporate portal.',
    demoUrl: 'https://xn--nabell-gva.com/',
    isFeatured: false,
  },
];

const sampleReviews = [
  {
    clientName: 'Marcus Vance',
    country: 'United States',
    rating: 5,
    comment: 'Exceptional web developer! Built our Squarespace website from scratch in record time. Pixel-perfect attention to detail and great communication throughout. Will hire again!',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$650',
    platform: 'Direct Client',
  },
  {
    clientName: 'Elena Rostova',
    country: 'United Kingdom',
    rating: 5,
    comment: 'Outstanding Wix Studio redesign! Shazzed took our clunky old website and transformed it into a modern, sleek masterpiece. Our leads increased by 40% in the first week.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$800',
    platform: 'Agency Partner',
  },
  {
    clientName: 'Dr. James Mitchell',
    country: 'Australia',
    rating: 5,
    comment: 'Delivered a world-class healthcare platform on Squarespace. Clean, professional, and fully responsive across all devices. Highly recommended for any serious business.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$1,200',
    platform: 'Corporate Project',
  },
  {
    clientName: 'Sophie Dubois',
    country: 'Switzerland',
    rating: 5,
    comment: 'Fantastic work on our Webflow SaaS landing page! Animations are super smooth and loading speed is 100/100 on Google PageSpeed. Truly a top-tier developer!',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$950',
    platform: 'Direct Client',
  },
  {
    clientName: 'Tariq Al-Mansoor',
    country: 'United Arab Emirates',
    rating: 5,
    comment: 'Created our luxury Shopify store with custom typography, bilingual layout, and lightning fast checkout. Delivered 2 days ahead of deadline. 10/10 stars!',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$1,500',
    platform: 'Agency Partner',
  },
  {
    clientName: 'Hannah Lindqvist',
    country: 'Sweden',
    rating: 5,
    comment: 'Transformed our Kajabi membership course portal. The design feels super premium and our students love the intuitive interface. A true expert in web design!',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    orderAmount: '$700',
    platform: 'Direct Client',
  },
];

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Seed Categories
    console.log('📦 Seeding categories...');
    const catMap = {};
    for (const cat of categoriesData) {
      const existing = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { name: cat.name, slug: cat.slug },
        { upsert: true, new: true }
      );
      catMap[cat.slug] = existing._id;
    }
    console.log(`✅ ${Object.keys(catMap).length} Categories synced`);

    // 2. Seed Reviews
    console.log('⭐ Seeding client reviews...');
    await Review.deleteMany({});
    const createdReviews = [];
    for (const rev of sampleReviews) {
      const reviewDoc = await Review.create({
        clientName: rev.clientName,
        platform: rev.platform || 'Fiverr',
        rating: rev.rating || 5,
        image: rev.imageUrl,
      });
      createdReviews.push(reviewDoc);
    }
    console.log(`✅ ${createdReviews.length} Reviews seeded`);

    // 3. Seed Projects
    console.log(`🚀 Seeding ${rawProjects.length} client projects...`);
    await Project.deleteMany({}); // Fresh project sync

    let count = 0;
    for (const p of rawProjects) {
      const catId = catMap[p.categorySlug] || catMap['wix'] || Object.values(catMap)[0];
      const slug = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const screenshot = getScreenshotUrl(p.demoUrl);
      const randomReview = count % 3 === 0 && createdReviews.length > 0
        ? createdReviews[count % createdReviews.length]._id
        : null;

      await Project.create({
        title: p.title,
        slug: slug,
        description: p.description,
        coverImage: screenshot,
        gallery: [
          { url: screenshot },
          { url: `https://image.thum.io/get/width/1200/crop/700/${p.demoUrl}` },
        ],
        demoUrl: p.demoUrl,
        category: catId,
        review: randomReview,
        isFeatured: p.isFeatured,
      });
      count++;
    }

    console.log(`🎉 Successfully seeded ${count} projects into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();
