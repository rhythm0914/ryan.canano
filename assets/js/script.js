// script.js
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking a link
    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const currentYearElements = document.querySelectorAll('#currentYear');
    currentYearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Animate skill bars when in viewport
    const skillBars = document.querySelectorAll('.skill-level');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            const parent = bar.parentElement;
            const percent = bar.parentElement.nextElementSibling || parent.nextElementSibling;
            
            // Check if element is in viewport
            const rect = parent.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.top <= (window.innerHeight * 0.8);
            
            if (isInViewport && bar.style.width === '') {
                // Animate the skill bar
                bar.style.width = `${level}%`;
                
                // Animate the percentage number
                animateValue(percent, 0, level, 1500);
            }
        });
    };
    
    // Function to animate counting up a value
    function animateValue(element, start, end, duration) {
        if (!element) return;
        
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = `${value}%`;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
    
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const parent = stat.parentElement;
            
            // Check if element is in viewport
            const rect = parent.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.top <= (window.innerHeight * 0.8);
            
            if (isInViewport && stat.textContent === '0') {
                animateValue(stat, 0, target, 2000);
            }
        });
    };
    
    // Animate experience timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const animateExperience = () => {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isInViewport = rect.top <= (window.innerHeight * 0.8);
            
            if (isInViewport) {
                item.classList.add('visible');
            }
        });
    };
    
    // Check for elements in viewport on scroll
    window.addEventListener('scroll', () => {
        animateSkills();
        animateStats();
        animateExperience();
    });
    
    // Trigger initial check
    setTimeout(() => {
        animateSkills();
        animateStats();
        animateExperience();
    }, 500);
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showFormMessage('Sending your message...', 'success');
            
            // Create form data object
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // In a real application, you would send this to a server
            console.log('Form submitted:', formData);
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    if (formMessage) {
                        formMessage.style.display = 'none';
                    }
                }, 5000);
            }, 1500);
        });
    }
    
    function showFormMessage(text, type) {
        if (!formMessage) return;
        
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or links to a different page
            if (href === '#' || href.includes('.html')) return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === `#${current}`) {
                anchor.classList.add('active');
            }
        });
    });
    
    // Add hover effect to project cards with delay
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Focus trap for mobile menu
        if (navLinks.classList.contains('active') && e.key === 'Tab') {
            const focusableElements = navLinks.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
    
    // Add loading animation for iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.3s';
        });
    });
    
    // Initialize tooltips for tech icons
    const techIcons = document.querySelectorAll('.tech-icons i');
    techIcons.forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = icon.title;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.style.zIndex = '1000';
        
        icon.style.position = 'relative';
        icon.appendChild(tooltip);
        
        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        });
        
        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Update active nav link on scroll end
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navAnchors.forEach(anchor => {
                anchor.classList.remove('active');
                if (anchor.getAttribute('href') === `#${current}`) {
                    anchor.classList.add('active');
                }
            });
        }, 100);
    });
});