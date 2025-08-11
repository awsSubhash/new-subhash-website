// Particle Background Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 80;
let mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = `hsl(${Math.random() * 30 + 25}, 70%, 60%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.05;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            this.x -= forceDirectionX * force * this.speedX * 2;
            this.y -= forceDirectionY * force * this.speedY * 2;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 153, 0, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();

// Welcome Message and Button Animation
document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.querySelector('#welcome-overlay');
    const welcomeMessage = document.querySelector('.welcome-message');
    const letsGoBtn = document.querySelector('#lets-go-btn');

    if (welcomeOverlay && welcomeMessage && letsGoBtn) {
        // Initial animation for welcome message
        gsap.from(welcomeMessage, {
            opacity: 0,
            scale: 0.5,
            y: 100,
            duration: 1.5,
            ease: 'power4.out',
            onStart: () => {
                welcomeOverlay.style.display = 'flex';
            }
        });

        // Initial animation for button
        gsap.from(letsGoBtn, {
            opacity: 0,
            scale: 0.7,
            y: 50,
            duration: 1.5,
            delay: 0.5,
            ease: 'elastic.out(1, 0.4)'
        });

        // Button click handler
        letsGoBtn.addEventListener('click', () => {
            // Enhance particle animation on click
            for (let i = 0; i < 50; i++) {
                particlesArray.push(new Particle());
            }

            // Animate button on click
            gsap.to(letsGoBtn, {
                scale: 0.8,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    gsap.to(letsGoBtn, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                }
            });

            // Animate welcome overlay out
            gsap.to(welcomeMessage, {
                opacity: 0,
                scale: 1.2,
                duration: 0.8,
                ease: 'power2.in'
            });

            gsap.to(welcomeOverlay, {
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    welcomeOverlay.classList.add('hidden');
                    welcomeOverlay.style.display = 'none';
                }
            });
        });
    }

    // Hero Text Animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const titleStrings = ['Subhash Kumar Singh', 'AWS Cloud Engineer'];
    const subtitleStrings = [
        'AWS Certified Cloud Engineer | DevOps Specialist',
        'Architecting Scalable Cloud Solutions'
    ];
    let currentTitleIndex = 0;
    let currentSubtitleIndex = 0;

    function updateText(element, text, isSubtitle = false) {
        element.innerHTML = text + '<span class="custom-cursor"></span>';
        if (!isSubtitle) {
            const gradientIndex = currentTitleIndex % 2;
            element.style.background = gradientIndex === 0
                ? 'linear-gradient(90deg, #fff, #ff9900)'
                : 'linear-gradient(90deg, #fff, #e68a00)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
        } else {
            element.style.color = '#d0d0d0';
        }
    }

    function animateText(element, text, delay, isSubtitle = false) {
        updateText(element, text, isSubtitle);
        gsap.fromTo(element,
            { opacity: 0.3, textShadow: '0 0 10px rgba(255, 153, 0, 0.3)' },
            {
                opacity: 1,
                textShadow: '0 0 15px rgba(255, 153, 0, 0.7)',
                duration: 0.6,
                ease: 'power2.inOut',
                repeat: 4,
                yoyo: true,
                delay: delay,
                onStart: () => {
                    element.style.opacity = '1';
                }
            }
        );
        return gsap.to(element, {
            opacity: 0,
            textShadow: '0 0 10px rgba(255, 153, 0, 0.3)',
            duration: 0.5,
            ease: 'power2.in',
            delay: delay + 3
        });
    }

    function cycleText() {
        const titlePromise = animateText(heroTitle, titleStrings[currentTitleIndex], 4);
        const subtitlePromise = animateText(heroSubtitle, subtitleStrings[currentSubtitleIndex], 4.5, true);

        Promise.all([titlePromise, subtitlePromise]).then(() => {
            currentTitleIndex = (currentTitleIndex + 1) % titleStrings.length;
            currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitleStrings.length;
            setTimeout(cycleText, 1000); // 1s pause between cycles
        });
    }

    if (heroTitle && heroSubtitle) {
        heroTitle.style.opacity = '0';
        heroSubtitle.style.opacity = '0';
        cycleText();
    }
});

// GSAP Animations
gsap.from(".btn", {
    opacity: 0,
    scale: 0.7,
    duration: 1.5,
    delay: 4.5,
    ease: "elastic.out(1, 0.4)"
});

gsap.from(".about h2, .about p", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 70,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
});

gsap.from(".skill-item", {
    scrollTrigger: {
        trigger: ".skills",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
});

gsap.from(".project-card", {
    scrollTrigger: {
        trigger: ".projects",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 120,
    duration: 1.2,
    stagger: 0.3,
    ease: "power4.out"
});

gsap.from(".blog-card", {
    scrollTrigger: {
        trigger: ".blog",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 120,
    duration: 1.2,
    stagger: 0.3,
    ease: "power4.out"
});

gsap.from(".testimonial-card", {
    scrollTrigger: {
        trigger: ".testimonials",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 120,
    duration: 1.2,
    stagger: 0.3,
    ease: "power4.out"
});

gsap.from(".education-card", {
    scrollTrigger: {
        trigger: ".education",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 120,
    duration: 1.2,
    stagger: 0.3,
    ease: "power4.out"
});

gsap.from(".contact h2, .contact form > *, .contact-info", {
    scrollTrigger: {
        trigger: ".contact",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    stagger: 0.25,
    ease: "power4.out"
});

gsap.from("nav", {
    y: -100,
    duration: 1.2,
    delay: 4,
    ease: "power4.out"
});
