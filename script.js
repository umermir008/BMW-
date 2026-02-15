// BMW Website Interactive JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupScrollEffects();
    setupNavigation();
    setupFormInteractions();
    setupVideoPlayer();
    setupSmoothScrolling();
    setupParallaxEffects();
});

// Initialize all animations
function initializeAnimations() {
    // Create Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Stagger animations for child elements
                const staggerElements = entry.target.querySelectorAll('[class*="stagger"]');
                staggerElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .about-text > *, .model-card, .tech-card, .contact-form, .map-container, .footer-logo, .footer-links, .footer-social, .video-container');
    
    animateElements.forEach(el => {
        if (!el.classList.contains('animate')) {
            el.classList.add('fade-in-up');
            observer.observe(el);
        }
    });
}

// Setup scroll effects
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('home');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        // Navbar background on scroll
        if (scrolled > 100) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
        
        // Parallax effect for hero section
        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallaxSpeed}px)`;
        }
        
        // Animate car rotation based on scroll
        const carImage = document.querySelector('.car-image');
        if (carImage) {
            const rotationAmount = scrolled * 0.1;
            carImage.style.transform = `rotateY(${rotationAmount % 360}deg)`;
        }
        
        // Progress indicator (optional)
        updateScrollProgress();
    });
}

// Update scroll progress
function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    
    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #0066CC, #0052a3);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = progress + '%';
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Add touch feedback
        mobileMenuBtn.addEventListener('touchstart', () => {
            mobileMenuBtn.style.transform = 'scale(0.95)';
        });
        
        mobileMenuBtn.addEventListener('touchend', () => {
            mobileMenuBtn.style.transform = 'scale(1)';
        });
    }
    
    // Hero CTA button scroll to models
    const heroCtaBtn = document.querySelector('.hero-cta');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => {
            document.getElementById('models').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Create mobile menu if it doesn't exist
    if (!mobileMenu) {
        const nav = document.querySelector('nav');
        const menuHTML = `
            <div id="mobile-menu" class="mobile-menu md:hidden bg-black/95 backdrop-blur-sm absolute top-full left-0 w-full z-40">
                <div class="px-6 py-6 space-y-1">
                    <a href="#home" class="block py-3 px-4 rounded-lg hover:text-bmw-blue transition-all duration-300">Home</a>
                    <a href="#about" class="block py-3 px-4 rounded-lg hover:text-bmw-blue transition-all duration-300">About</a>
                    <a href="#models" class="block py-3 px-4 rounded-lg hover:text-bmw-blue transition-all duration-300">Models</a>
                    <a href="#technology" class="block py-3 px-4 rounded-lg hover:text-bmw-blue transition-all duration-300">Technology</a>
                    <a href="#contact" class="block py-3 px-4 rounded-lg hover:text-bmw-blue transition-all duration-300">Contact</a>
                </div>
            </div>
        `;
        nav.insertAdjacentHTML('beforeend', menuHTML);
        
        // Add click handlers to mobile menu links
        const mobileLinks = document.querySelectorAll('#mobile-menu a');
        mobileLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close menu after navigation
                setTimeout(() => {
                    toggleMobileMenu();
                }, 300);
            });
        });
    }
    
    const menu = document.getElementById('mobile-menu');
    const isActive = mobileMenuBtn.classList.contains('mobile-menu-active');
    
    if (isActive) {
        // Close menu
        mobileMenuBtn.classList.remove('mobile-menu-active');
        menu.classList.remove('active');
        
        // Remove scroll lock
        document.body.style.overflow = '';
        
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    } else {
        // Open menu
        mobileMenuBtn.classList.add('mobile-menu-active');
        menu.classList.add('active');
        
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }
    }
    
    // Add ripple effect to button
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 102, 204, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 40px;
        height: 40px;
        left: 50%;
        top: 50%;
        margin-left: -20px;
        margin-top: -20px;
    `;
    
    mobileMenuBtn.style.position = 'relative';
    mobileMenuBtn.appendChild(ripple);
    
    setTimeout(() => {
        if (mobileMenuBtn.contains(ripple)) {
            mobileMenuBtn.removeChild(ripple);
        }
    }, 600);
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
        const isMenuOpen = mobileMenuBtn.classList.contains('mobile-menu-active');
        const clickedInsideMenu = mobileMenu.contains(e.target);
        const clickedMenuButton = mobileMenuBtn.contains(e.target);
        
        if (isMenuOpen && !clickedInsideMenu && !clickedMenuButton) {
            toggleMobileMenu();
        }
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn && mobileMenuBtn.classList.contains('mobile-menu-active')) {
            toggleMobileMenu();
        }
    }
});

// Setup form interactions
function setupFormInteractions() {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input, textarea, select');
    
    // Add focus/blur effects
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 102, 204, 0.3)';
            e.target.style.borderColor = '#0066CC';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.style.boxShadow = '';
            e.target.style.borderColor = '#4a5568';
        });
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Scheduling...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Scheduled Successfully!';
                submitBtn.style.backgroundColor = '#10b981';
                
                // Show success message
                showNotification('Test drive scheduled successfully! We will contact you soon.', 'success');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                }, 3000);
            }, 2000);
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-600' : 'bg-bmw-blue'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Setup video player
function setupVideoPlayer() {
    const playButton = document.querySelector('.play-button');
    const videoContainer = document.querySelector('.video-container');
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            // Create video element
            const video = document.createElement('video');
            video.src = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'; // Replace with actual BMW video
            video.controls = true;
            video.autoplay = true;
            video.className = 'w-full h-full object-cover rounded-lg';
            
            // Replace thumbnail with video
            const aspectDiv = videoContainer.querySelector('.aspect-video');
            aspectDiv.innerHTML = '';
            aspectDiv.appendChild(video);
            
            // Add fullscreen button
            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.className = 'absolute top-4 right-4 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition-colors';
            fullscreenBtn.addEventListener('click', () => {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                }
            });
            aspectDiv.appendChild(fullscreenBtn);
        });
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup parallax effects
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero background
        const heroBackground = document.querySelector('#home .absolute.inset-0');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Floating animation for BMW logo in hero
        const heroLogo = document.querySelector('.bmw-hero-logo');
        if (heroLogo) {
            const floating = Math.sin(scrolled * 0.01) * 10;
            heroLogo.style.transform = `translateY(${floating}px)`;
        }
    });
}

// Add ripple effect to buttons
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        addRippleEffect(button, e);
    }
});

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Setup model card interactions
function setupModelCards() {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        const learnMoreBtn = card.querySelector('button');
        
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                const modelName = card.querySelector('h3').textContent;
                showModelDetails(modelName);
            });
        }
    });
}

// Show model details (mock function)
function showModelDetails(modelName) {
    const modal = createModal(`
        <div class="bg-bmw-dark rounded-lg p-8 max-w-2xl w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-white">${modelName} Details</h2>
                <button class="close-modal text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            
            <div class="space-y-4 text-gray-300">
                <p>Discover the exceptional features and performance of the ${modelName}.</p>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <strong class="text-bmw-blue">Engine:</strong> TwinPower Turbo
                    </div>
                    <div>
                        <strong class="text-bmw-blue">Power:</strong> 382 HP
                    </div>
                    <div>
                        <strong class="text-bmw-blue">0-60 mph:</strong> 4.8 seconds
                    </div>
                    <div>
                        <strong class="text-bmw-blue">Fuel Economy:</strong> 26 MPG
                    </div>
                </div>
                
                <div class="mt-6">
                    <button class="bg-bmw-blue hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                        Schedule Test Drive
                    </button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Create modal
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
    modal.innerHTML = content;
    return modal;
}

// Initialize model cards when DOM is ready
document.addEventListener('DOMContentLoaded', setupModelCards);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.fixed.inset-0.z-50');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    setupScrollEffects();
    setupParallaxEffects();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hide loading spinner if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});