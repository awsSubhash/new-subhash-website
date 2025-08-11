document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle (for mobile)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Fetch Content with Retry
    fetchContentWithRetry(3);

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                throw new Error(`Failed to send message: ${response.status}`);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('Error sending message. Please try again later.');
        }
    });

    // Admin Modal
    const adminModal = document.getElementById('admin-modal');
    const adminLoginForm = document.getElementById('admin-login-form');
    const closeModal = document.querySelector('.close');

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'l') {
            adminModal.style.display = 'flex';
        }
    });

    closeModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (response.ok) {
                window.location.href = '/admin';
            } else {
                alert('Invalid password');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            alert('Error logging in. Please try again.');
        }
    });

    // Tawk.to Page Navigation Tracking
    function updateTawkToPage(section) {
        const sectionNames = {
            'home': 'Home',
            'about': 'About',
            'skills': 'Skills',
            'projects': 'Projects',
            'blog': 'Blog',
            'testimonials': 'Testimonials',
            'education': 'Education',
            'contact': 'Contact'
        };
        const pageName = sectionNames[section] || 'Unknown Section';
        
        // Use addEvent for navigation tracking
        if (typeof Tawk_API !== 'undefined' && Tawk_API.addEvent) {
            Tawk_API.addEvent('page-navigation', { page: pageName }, (error) => {
                if (error) {
                    console.error('Tawk.to addEvent error:', error);
                } else {
                    console.log(`Tawk.to event sent: Navigated to ${pageName}`);
                }
            });
            
            // Also update visitor attributes
            Tawk_API.setAttributes({
                currentPage: pageName
            }, (error) => {
                if (error) {
                    console.error('Tawk.to setAttributes error:', error);
                } else {
                    console.log(`Tawk.to attribute updated: currentPage = ${pageName}`);
                }
            });
        } else {
            console.warn('Tawk_API not available, retrying...');
            // Retry after a delay
            setTimeout(() => updateTawkToPage(section), 1000);
        }
    }

    // Wait for Tawk.to to load
    function waitForTawkTo(callback) {
        if (typeof Tawk_API !== 'undefined' && Tawk_API.onLoad) {
            Tawk_API.onLoad = () => {
                console.log('Tawk.to loaded successfully');
                callback();
            };
        } else {
            console.log('Waiting for Tawk.to to load...');
            setTimeout(() => waitForTawkTo(callback), 500);
        }
    }

    // Track hash changes
    window.addEventListener('hashchange', () => {
        const section = window.location.hash.replace('#', '') || 'home';
        updateTawkToPage(section);
    });

    // Track initial page load
    waitForTawkTo(() => {
        const initialSection = window.location.hash.replace('#', '') || 'home';
        updateTawkToPage(initialSection);
    });

    // Track section visibility with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    const sections = ['home', 'about', 'skills', 'projects', 'blog', 'testimonials', 'education', 'contact'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            ScrollTrigger.create({
                trigger: element,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => updateTawkToPage(section),
                onEnterBack: () => updateTawkToPage(section)
            });
        }
    });
});

async function fetchContentWithRetry(maxRetries, retryDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('/api/content', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Render About
            const aboutContent = document.getElementById('about-content');
            if (aboutContent) {
                aboutContent.innerHTML = data.about || '<p>No about content available.</p>';
            } else {
                console.error('Element with id "about-content" not found');
            }

            // Render Skills
            const skillsContent = document.getElementById('skills-content');
            if (skillsContent) {
                skillsContent.innerHTML = data.skills && data.skills.length
                    ? data.skills.map(skill => `
                        <div class="skill-item">
                            <i class="fas ${skill.icon}"></i>
                            <p>${skill.name}</p>
                        </div>
                    `).join('')
                    : '<p>No skills available.</p>';
            } else {
                console.error('Element with id "skills-content" not found');
            }

            // Render Projects
            const projectsContent = document.getElementById('projects-content');
            if (projectsContent) {
                projectsContent.innerHTML = data.projects && data.projects.length
                    ? data.projects.map(project => `
                        <div class="project-card">
                            <img src="${project.image || 'https://via.placeholder.com/300x220?text=' + project.title}" alt="${project.title}">
                            <h3>${project.title}</h3>
                            <p><strong>${project.company} | ${project.duration}</strong></p>
                            <ul>${project.description.map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>
                    `).join('')
                    : '<p>No projects available.</p>';
            } else {
                console.error('Element with id "projects-content" not found');
            }

            // Render Blog
            const blogContent = document.getElementById('blog-content');
            if (blogContent) {
                blogContent.innerHTML = data.blog && data.blog.length
                    ? data.blog.map(post => `
                        <div class="blog-card">
                            <h3>${post.title}</h3>
                            <p>${post.excerpt}</p>
                        </div>
                    `).join('')
                    : '<p>No blog posts available.</p>';
            } else {
                console.error('Element with id "blog-content" not found');
            }

            // Render Testimonials
            const testimonialsContent = document.getElementById('testimonials-content');
            if (testimonialsContent) {
                testimonialsContent.innerHTML = data.testimonials && data.testimonials.length
                    ? data.testimonials.map(testimonial => `
                        <div class="testimonial-card">
                            <p>${testimonial.text}</p>
                            <p><strong>${testimonial.author}</strong></p>
                        </div>
                    `).join('')
                    : '<p>No testimonials available.</p>';
            } else {
                console.error('Element with id "testimonials-content" not found');
            }

            // Render Education
            const educationContent = document.getElementById('education-content');
            if (educationContent) {
                educationContent.innerHTML = data.education && data.education.length
                    ? data.education.map(edu => `
                        <div class="education-card">
                            <h3>${edu.title}</h3>
                            <p>${edu.institution} | ${edu.year}</p>
                            ${edu.validation ? `<p>Validation: ${edu.validation}</p>` : ''}
                        </div>
                    `).join('')
                    : '<p>No education details available.</p>';
            } else {
                console.error('Element with id "education-content" not found');
            }

            // Refresh GSAP ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.refresh();
            return; // Success, exit retry loop
        } catch (error) {
            console.error(`Fetch attempt ${attempt} failed:`, error);
            if (attempt === maxRetries) {
                // Display detailed error in UI
                const errorMessage = `<p>Error loading content: ${error.message}. Please check if the server is running and content.json is accessible.</p>`;
                document.getElementById('about-content').innerHTML = errorMessage;
                document.getElementById('skills-content').innerHTML = errorMessage;
                document.getElementById('projects-content').innerHTML = errorMessage;
                document.getElementById('blog-content').innerHTML = errorMessage;
                document.getElementById('testimonials-content').innerHTML = errorMessage;
                document.getElementById('education-content').innerHTML = errorMessage;
            } else {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
}
