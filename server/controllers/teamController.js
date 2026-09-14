const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const TeamMember = require('../models/TeamMember');
const Settings = require('../models/Settings');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/team
 * @access  Public
 */
const getTeamData = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      siteName: 'Shazzed Shuvo',
      tagline: 'Web Specialist & Web Developer',
      teamName: 'Dont Worry',
      teamTagline: 'Collaborative Excellence in Web Development & CMS Solutions',
      teamDescription:
        'A multidisciplinary team of dedicated web engineers, designers, and CMS specialists delivering bespoke digital experiences with 100% precision.',
    });
  }

  const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

  res.json({
    teamName: settings.teamName || 'Dont Worry',
    teamTagline: settings.teamTagline || 'Collaborative Excellence in Web Development & CMS Solutions',
    teamDescription:
      settings.teamDescription ||
      'A multidisciplinary team of dedicated web engineers, designers, and CMS specialists delivering bespoke digital experiences with 100% precision.',
    members,
  });
});

/**
 * @route   GET /api/team/admin/all
 * @access  Admin
 */
const getAllTeamDataAdmin = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });

  res.json({
    teamName: settings?.teamName || 'Dont Worry',
    teamTagline: settings?.teamTagline || '',
    teamDescription: settings?.teamDescription || '',
    members,
  });
});

/**
 * @route   POST /api/team/members
 * @access  Admin
 */
const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, bio, skills, experience, email, github, linkedin, portfolio, twitter, order, isActive } = req.body;

  if (!name || !role) {
    res.status(400);
    throw new Error('Name and role are required');
  }

  let avatarUrl = req.body.avatar || '';

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/team');
    avatarUrl = uploadResult.secure_url;
  }

  // Parse skills
  let parsedSkills = [];
  if (skills) {
    parsedSkills = Array.isArray(skills)
      ? skills
      : skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  const member = await TeamMember.create({
    name,
    role,
    avatar: avatarUrl,
    bio: bio || '',
    skills: parsedSkills,
    experience: experience || '3+ Years',
    email: email || '',
    socialLinks: {
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      twitter: twitter || '',
    },
    order: order ? Number(order) : 0,
    isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
  });

  res.status(201).json(member);
});

/**
 * @route   PUT /api/team/members/:id
 * @access  Admin
 */
const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  const { name, role, bio, skills, experience, email, github, linkedin, portfolio, twitter, order, isActive } = req.body;

  if (name) member.name = name;
  if (role) member.role = role;
  if (bio !== undefined) member.bio = bio;
  if (experience !== undefined) member.experience = experience;
  if (email !== undefined) member.email = email;
  if (order !== undefined) member.order = Number(order);
  if (isActive !== undefined) {
    member.isActive = isActive === 'true' || isActive === true;
  }

  if (skills !== undefined) {
    member.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (github !== undefined || linkedin !== undefined || portfolio !== undefined || twitter !== undefined) {
    member.socialLinks = {
      github: github !== undefined ? github : member.socialLinks?.github,
      linkedin: linkedin !== undefined ? linkedin : member.socialLinks?.linkedin,
      portfolio: portfolio !== undefined ? portfolio : member.socialLinks?.portfolio,
      twitter: twitter !== undefined ? twitter : member.socialLinks?.twitter,
    };
  }

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/team');
    member.avatar = uploadResult.secure_url;
  } else if (req.body.avatar !== undefined) {
    member.avatar = req.body.avatar;
  }

  const updated = await member.save();
  res.json(updated);
});

/**
 * @route   DELETE /api/team/members/:id
 * @access  Admin
 */
const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  await member.deleteOne();
  res.json({ message: 'Team member deleted successfully', id: req.params.id });
});

/**
 * @route   PUT /api/team/info
 * @access  Admin
 */
const updateTeamInfo = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  const { teamName, teamTagline, teamDescription } = req.body;

  if (teamName !== undefined) settings.teamName = teamName;
  if (teamTagline !== undefined) settings.teamTagline = teamTagline;
  if (teamDescription !== undefined) settings.teamDescription = teamDescription;

  const updated = await settings.save();
  res.json({
    teamName: updated.teamName,
    teamTagline: updated.teamTagline,
    teamDescription: updated.teamDescription,
  });
});

module.exports = {
  getTeamData,
  getAllTeamDataAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamInfo,
};
