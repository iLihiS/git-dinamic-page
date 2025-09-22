// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active navigation link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (correspondingLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                correspondingLink.classList.add('active');
            }
        });
    });
    
    // Animate list items on scroll
    const listObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const listObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Future work section is visible!');
                const listItems = entry.target.querySelectorAll('li');
                console.log('Found list items:', listItems.length);
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        console.log('Animating item', index);
                        item.classList.add('animate-in');
                    }, index * 400); // 400ms delay between each item
                });
            } else {
                // Reset animation when leaving viewport
                const listItems = entry.target.querySelectorAll('li');
                listItems.forEach(item => {
                    item.classList.remove('animate-in');
                });
            }
        });
    }, listObserverOptions);
    
    // Observe future work list specifically
    const futureWorkBlocks = document.querySelectorAll('.future-work-list');
    console.log('Found future work blocks:', futureWorkBlocks.length);
    futureWorkBlocks.forEach(block => {
        if (block.querySelector('ul')) {
            console.log('Observing future work block');
            listObserver.observe(block);
        }
    });
    
    // Animate installation steps on scroll
    const installationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Installation steps section is visible!');
                const steps = entry.target.querySelectorAll('.installation-step');
                console.log('Found installation steps:', steps.length);
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        console.log('Animating step', index + 1);
                        step.classList.add('animate-in');
                    }, index * 500); // 500ms delay between each step
                });
            } else {
                // Reset animation when leaving viewport
                const steps = entry.target.querySelectorAll('.installation-step');
                steps.forEach(step => {
                    step.classList.remove('animate-in');
                });
            }
        });
    }, listObserverOptions);
    
    // Observe installation steps
    const installationSteps = document.querySelectorAll('.installation-steps');
    installationSteps.forEach(block => {
        installationObserver.observe(block);
    });
    
    // Video auto-play/pause and smooth scaling
    const videoContainer = document.querySelector('.marketing-demo');
    const video = document.querySelector('.marketing-demo video');
    
    if (videoContainer && video) {
        // Set video volume to 50%
        video.volume = 0.5;
        
        // Video intersection observer for play/pause
        const videoPlayObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is visible - play it
                    video.muted = true; // Ensure muted for autoplay
                    video.play().then(() => {
                        // Successfully started - now unmute and set volume
                        video.muted = false;
                        video.volume = 0.5;
                        console.log('Video started playing with 50% volume');
                    }).catch(e => {
                        console.log('Auto-play prevented:', e);
                    });
                } else {
                    // Video is not visible - pause it
                    video.pause();
                    console.log('Video paused');
                }
            });
        }, {
            threshold: 0.2 // Play when 20% of video is visible (earlier trigger)
        });
        
        videoPlayObserver.observe(videoContainer);
        
        // Smooth scaling effect
        function updateVideoScale() {
            const rect = videoContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const videoCenter = rect.top + rect.height / 2;
            // Move the optimal point lower than screen center (60% down from top)
            const optimalPoint = windowHeight * 0.6;
            
            // Only scale if video is visible
            if (rect.bottom > 0 && rect.top < windowHeight) {
                // Define center zone (40% of screen height for smoother effect)
                const centerZoneHeight = windowHeight * 0.4;
                const distanceFromOptimal = Math.abs(videoCenter - optimalPoint);
                const maxDistance = centerZoneHeight / 2;
                
                let scale = 1;
                let translateY = 0;
                
                if (distanceFromOptimal < maxDistance) {
                    // Calculate smooth progress (0 to 1)
                    const progress = 1 - (distanceFromOptimal / maxDistance);
                    
                    // Gentle scaling from 1 to 1.8
                    scale = 1 + (progress * 0.8);
                    
                    // Slight upward movement
                    translateY = -progress * 15;
                    
                    console.log(`Video scaling: ${scale.toFixed(2)}, progress: ${progress.toFixed(2)}, optimal point: ${optimalPoint}px`);
                }
                
                // Apply smooth transformation
                video.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                video.style.zIndex = scale > 1.3 ? '1500' : 'auto';
            } else {
                // Reset when not visible
                video.style.transform = 'scale(1) translateY(0px)';
                video.style.zIndex = 'auto';
            }
        }
        
        // Smooth scroll handling with throttling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateVideoScale();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial call
        updateVideoScale();
    }
    
    // General scroll animations for sections and titles
    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Reset animation when leaving viewport
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections and titles
    const elementsToAnimate = document.querySelectorAll('.section-title, .contribution-item, .example-row, .detail-block');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        generalObserver.observe(element);
    });
    
    // Add scroll effect to navbar and footer
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const footer = document.querySelector('.footer');
        
        // Navbar effect
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Footer effect - check if at bottom
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // If scrolled to within 100px of bottom
        if (scrollTop + windowHeight >= documentHeight - 100) {
            footer.classList.add('at-bottom');
        } else {
            footer.classList.remove('at-bottom');
        }
    });
});

// Copy code to clipboard function
function copyToClipboard(button, step) {
    let codeText = '';
    
    // Get the appropriate code based on the step
    switch(step) {
        case 'step1':
            codeText = `git clone https://github.com/iLihiS/git-dinamic-page.git
cd git-dinamic-page`;
            break;
        case 'step2':
            codeText = `pip install -r requirements.txt`;
            break;
        case 'step3':
            codeText = `python main.py`;
            break;
        default:
            codeText = 'Code not found';
    }
    
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = codeText;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Update the specific button that was clicked
        const originalContent = button.innerHTML;
        const originalBackground = button.style.background;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'linear-gradient(135deg, rgba(1, 254, 238, 0.5) 0%, rgba(165, 102, 229, 0.5) 100%)';
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = originalBackground || '#374151';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy code: ', err);
        alert('Failed to copy code. Please copy it manually.');
    }
    
    document.body.removeChild(textarea);
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.example-image img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            // If image fails to load, show placeholder
            this.parentElement.innerHTML = '<i class="fas fa-image"></i>';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Ensure already-loaded images are visible
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.contribution-item, .example-item, .detail-block');
    
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);

// Add CSS for active state
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #3b82f6;
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
    
    .contribution-item.active,
    .example-item.active,
    .detail-block.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav-links.mobile-active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 1rem;
        }
        
        .nav-links {
            display: none;
        }
        
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }
    
    @media (min-width: 769px) {
        .mobile-menu-btn {
            display: none;
        }
        
        .nav-links {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style); 