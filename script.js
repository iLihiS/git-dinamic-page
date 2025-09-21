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
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll('.section, .contribution-item, .example-item, .detail-block');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Copy citation to clipboard function
function copyToClipboard() {
    const citationText = `@inproceedings{vidrakimronnoyshamir2025playing,
  title={Playing Along - Building AI Agents for Co-Creation of Improvised Stories},
  author={Vidra, Idan Dov and Kimron, Gal and Noy, Lior and Shamir, Ariel},
  booktitle={Proceedings of the 16th International Conference on Computational Creativity},
  year={2025}
}`;
    
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = citationText;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Update button text temporarily
        const copyBtn = document.querySelector('.copy-btn');
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.style.background = '#374151';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy citation: ', err);
        alert('Failed to copy citation. Please copy it manually.');
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