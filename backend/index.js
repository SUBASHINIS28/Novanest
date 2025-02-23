require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User'); // Ensure this path is correct
const Startup = require('./models/Startup'); // Ensure this path is correct
const InvestmentOpportunity = require('./models/InvestmentOpportunity'); // Ensure this path is correct
const authMiddleware = require('./middleware/authMiddleware'); // Ensure this path is correct
const roleMiddleware = require('./middleware/roleMiddleware'); // Ensure this path is correct
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const founderMiddleware = require('./middleware/founderMiddleware'); // Add this line

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'startups',
    format: async (req, file) => 'pdf', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

app.post('/register', async (req, res) => {
  const { name, email, password, role, profileDetails } = req.body;
  try {
    const user = new User({ name, email, password, role, profileDetails });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password, role, profileDetails } = req.body;
  try {
    const user = new User({ name, email, password, role, profileDetails });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role }); // Include role in the response
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});

// Protected Route Example
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Protected Route Example for Entrepreneurs
app.get('/entrepreneur-dashboard', authMiddleware, roleMiddleware(['entrepreneur']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ message: 'Welcome to the Entrepreneur Dashboard', user });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Protected Route Example for Investors
app.get('/investor-dashboard', authMiddleware, roleMiddleware(['investor']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ message: 'Welcome to the Investor Dashboard', user });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Protected Route Example for Mentors
app.get('/mentor-dashboard', authMiddleware, roleMiddleware(['mentor']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ message: 'Welcome to the Mentor Dashboard', user });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get startups
app.get('/startups', async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get mentors
app.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get investment opportunities
app.get('/investment-opportunities', async (req, res) => {
  try {
    const opportunities = await InvestmentOpportunity.find();
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET route to fetch all investment opportunities
app.get('/api/investment-opportunities', async (req, res) => {
  try {
    const investmentOpportunities = await InvestmentOpportunity.find();
    res.status(200).json(investmentOpportunities);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET route to fetch a single investment opportunity by ID
app.get('/api/investment-opportunities/:id', async (req, res) => {
  try {
    const investmentOpportunity = await InvestmentOpportunity.findById(req.params.id);
    if (!investmentOpportunity) {
      return res.status(404).send('Investment opportunity not found');
    }
    res.status(200).json(investmentOpportunity);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PUT route to update an investment opportunity
app.put('/api/investment-opportunities/:id', authMiddleware, async (req, res) => {
  const { title, details } = req.body;

  try {
    const investmentOpportunity = await InvestmentOpportunity.findByIdAndUpdate(
      req.params.id,
      { title, details },
      { new: true, runValidators: true }
    );
    if (!investmentOpportunity) {
      return res.status(404).send('Investment opportunity not found');
    }
    res.status(200).json(investmentOpportunity);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE route to delete an investment opportunity
app.delete('/api/investment-opportunities/:id', authMiddleware, async (req, res) => {
  try {
    const investmentOpportunity = await InvestmentOpportunity.findByIdAndDelete(req.params.id);
    if (!investmentOpportunity) {
      return res.status(404).send('Investment opportunity not found');
    }
    res.status(200).send('Investment opportunity deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get pitch decks
app.get('/pitch-decks', async (req, res) => {
  try {
    const pitchDecks = await PitchDeck.find();
    res.status(200).json(pitchDecks);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get entrepreneurs
app.get('/entrepreneurs', async (req, res) => {
  try {
    const entrepreneurs = await User.find({ role: 'entrepreneur' });
    res.status(200).json(entrepreneurs);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST route to save startup details
app.post('/api/startups', authMiddleware, upload.single('pitchDeck'), async (req, res) => {
  const { name, industry, description, fundingNeeded } = req.body;
  const pitchDeckUrl = req.file.path;

  try {
    const startup = new Startup({
      name,
      industry,
      description,
      fundingNeeded,
      pitchDeckUrl,
      createdBy: req.user.id,
    });
    await startup.save();
    res.status(201).json(startup);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint to get startup details by ID
app.get('/api/startups/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('createdBy', 'name email profileDetails');
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    res.status(200).json(startup);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST route to create a new investment opportunity
app.post('/api/investment-opportunities', authMiddleware, async (req, res) => {
  const { title, details } = req.body;

  try {
    const investmentOpportunity = new InvestmentOpportunity({
      title,
      details,
      // Add more fields as needed
    });
    await investmentOpportunity.save();
    res.status(201).json(investmentOpportunity);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// PUT route to update a startup
app.put('/api/startups/:id', authMiddleware, founderMiddleware, async (req, res) => {
  const { name, industry, description, fundingNeeded } = req.body;

  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { name, industry, description, fundingNeeded },
      { new: true, runValidators: true }
    );
    if (!startup) {
      return res.status(404).send('Startup not found');
    }
    res.status(200).json(startup);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint to get startups by entrepreneur ID
app.get('/api/entrepreneurs/:id/startups', authMiddleware, async (req, res) => {
  try {
    const startups = await Startup.find({ createdBy: req.params.id });
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

mongoose.connect("mongodb://localhost:27017/novanest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));