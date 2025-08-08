const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const contentPath = path.join(__dirname, '../data/content.json');

// Fallback content in case content.json is missing or invalid
const fallbackContent = {
    about: "<p>Welcome to my portfolio! I'm Subhash Kumar Singh, an AWS Cloud Engineer.</p>",
    skills: [],
    projects: [],
    blog: [],
    testimonials: [],
    education: []
};

// Get content
router.get('/content', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const parsedData = JSON.parse(data);
        res.json(parsedData);
    } catch (error) {
        console.error('Error reading content.json:', error.message);
        if (error.code === 'ENOENT') {
            console.error(`File not found: ${contentPath}`);
            // Create content.json with fallback content if missing
            try {
                await fs.writeFile(contentPath, JSON.stringify(fallbackContent, null, 2));
                console.log(`Created content.json at ${contentPath}`);
                res.json(fallbackContent);
            } catch (writeError) {
                console.error('Error creating content.json:', writeError);
                res.status(500).json({ message: 'Error creating content file', error: writeError.message });
            }
        } else {
            console.error('JSON parsing or other error:', error);
            res.status(500).json({ message: 'Error fetching content', error: error.message });
        }
    }
});

// Update about content
router.post('/content', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.about = req.body.about;
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Content updated' });
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ message: 'Error updating content' });
    }
});

// Add skill
router.post('/content/skills', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.skills.push(req.body);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Skill added' });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ message: 'Error adding skill' });
    }
});

// Delete skill
router.delete('/content/skills', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.skills = content.skills.filter(skill => skill.name !== req.body.name);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Skill deleted' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Error deleting skill' });
    }
});

// Add project
router.post('/content/projects', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.projects.push(req.body);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Project added' });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ message: 'Error adding project' });
    }
});

// Delete project
router.delete('/content/projects', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.projects = content.projects.filter(project => project.title !== req.body.title);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
});

// Add blog post
router.post('/content/blog', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.blog.push(req.body);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Blog post added' });
    } catch (error) {
        console.error('Error adding blog post:', error);
        res.status(500).json({ message: 'Error adding blog post' });
    }
});

// Delete blog post
router.delete('/content/blog', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.blog = content.blog.filter(post => post.title !== req.body.title);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Blog post deleted' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post' });
    }
});

// Add testimonial
router.post('/content/testimonials', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.testimonials.push(req.body);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Testimonial added' });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        res.status(500).json({ message: 'Error adding testimonial' });
    }
});

// Delete testimonial
router.delete('/content/testimonials', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.testimonials = content.testimonials.filter(testimonial => testimonial.author !== req.body.author);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Testimonial deleted' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ message: 'Error deleting testimonial' });
    }
});

// Add education
router.post('/content/education', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.education.push(req.body);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Education added' });
    } catch (error) {
        console.error('Error adding education:', error);
        res.status(500).json({ message: 'Error adding education' });
    }
});

// Delete education
router.delete('/content/education', async (req, res) => {
    try {
        const data = await fs.readFile(contentPath, 'utf8');
        const content = JSON.parse(data);
        content.education = content.education.filter(edu => edu.title !== req.body.title);
        await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
        res.status(200).json({ message: 'Education deleted' });
    } catch (error) {
        console.error('Error deleting education:', error);
        res.status(500).json({ message: 'Error deleting education' });
    }
});

// Handle contact form
router.post('/contact', async (req, res) => {
    try {
        console.log('Contact form submission:', req.body);
        res.status(200).json({ message: 'Message received' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ message: 'Error processing contact form' });
    }
});

// Admin login
router.post('/admin/login', async (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') { // Replace with secure auth in production
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
});

module.exports = router;
