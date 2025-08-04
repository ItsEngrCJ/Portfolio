// Smooth scroll for navigation
const navLinks = document.querySelectorAll('.navbar a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Navigation highlighting based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], header[id="hero"]');
  const navLinks = document.querySelectorAll('.navbar a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Remove active class from all nav links
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current section's nav link
  if (currentSection) {
    const activeLink = document.querySelector(`.navbar a[href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Add scroll event listener for navigation highlighting
window.addEventListener('scroll', updateActiveNavLink);

// Old contact form submission - removed to avoid conflicts

// Parallax effect for hero shapes
function heroParallax() {
  if (window.innerWidth <= 900) return;
  const scrollY = window.scrollY;
  const shape1 = document.querySelector('.shape1');
  const shape2 = document.querySelector('.shape2');
  const shape3 = document.querySelector('.shape3');
  const shape4 = document.querySelector('.shape4');
  const shape5 = document.querySelector('.shape5');
  const shape6 = document.querySelector('.shape6');
  if (shape1) shape1.style.transform = `translateY(${scrollY * 0.18}px)`;
  if (shape2) shape2.style.transform = `translateY(${scrollY * 0.12}px)`;
  if (shape3) shape3.style.transform = `translateY(${-scrollY * 0.10}px)`;
  if (shape4) shape4.style.transform = `translate(${scrollY * 0.08}px, ${-scrollY * 0.13}px)`;
  if (shape5) shape5.style.transform = `translate(${-scrollY * 0.09}px, ${scrollY * 0.07}px) rotate(${scrollY * 0.12}deg)`;
  if (shape6) shape6.style.transform = `translateY(${scrollY * 0.15}px)`;
}
window.addEventListener('scroll', heroParallax);

// Parallax effect for hero image layers
function heroImageParallax() {
  if (window.innerWidth <= 900) return;
  const scrollY = window.scrollY;
  const p1 = document.querySelector('.parallax-img.p1');
  const p2 = document.querySelector('.parallax-img.p2');
  const p3 = document.querySelector('.parallax-img.p3');
  const p4 = document.querySelector('.parallax-img.p4');
  if (p1) p1.style.transform = `translateY(${scrollY * 0.16}px)`;
  if (p2) p2.style.transform = `translateY(${scrollY * 0.64}px)`;
  if (p3) p3.style.transform = `translateY(${scrollY * 0.32}px)`;
  if (p4) p4.style.transform = `translateY(${scrollY * 0.42}px)`;
}
window.addEventListener('scroll', heroImageParallax);

// Profile image carousel functionality
const profileImages = document.querySelectorAll('.about-content > img.profile-pic');
let currentImageIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let autoPlayInterval = null;
let autoPlayDelay = 2000; // 2.5 seconds

function bringImageToFront(index) {
  profileImages.forEach((img, i) => {
    if (i === index) {
      img.style.zIndex = '4';
      img.style.transform = 'translateX(0px) translateY(0px) scale(1.1)';
    } else if (i === (index + 1) % profileImages.length) {
      img.style.zIndex = '3';
      img.style.transform = 'translateX(20px) translateY(10px) scale(1)';
    } else {
      img.style.zIndex = '2';
      img.style.transform = 'translateX(-20px) translateY(-10px) scale(0.9)';
    }
  });
  currentImageIndex = index;
}

function nextImage() {
  const nextIndex = (currentImageIndex + 1) % profileImages.length;
  bringImageToFront(nextIndex);
}

function startAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextImage, autoPlayDelay);
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

// Start auto-play when page loads
startAutoPlay();

// Add click event listeners to each image
profileImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    if (!isDragging) {
      bringImageToFront(index);
      // Restart auto-play after manual interaction
      stopAutoPlay();
      setTimeout(startAutoPlay, 3000);
    }
  });
  
  // Pause auto-play on hover
  img.addEventListener('mouseenter', stopAutoPlay);
  img.addEventListener('mouseleave', startAutoPlay);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    const nextIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
    bringImageToFront(nextIndex);
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  } else if (e.key === 'ArrowRight') {
    const nextIndex = (currentImageIndex + 1) % profileImages.length;
    bringImageToFront(nextIndex);
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000);
  }
});

// Add drag functionality
profileImages.forEach(img => {
  img.addEventListener('mousedown', startDrag);
  img.addEventListener('touchstart', startDrag);
});

function startDrag(e) {
  isDragging = true;
  stopAutoPlay(); // Stop auto-play when dragging starts
  startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
  currentX = startX;
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
  
  e.preventDefault();
}

function drag(e) {
  if (!isDragging) return;
  
  currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const diff = currentX - startX;
  const threshold = 100;
  
  // Calculate progress (0 to 1) based on drag distance
  const progress = Math.min(Math.abs(diff) / threshold, 1);
  
  if (diff > 0) {
    // Dragging right - bring previous image forward
    const prevIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
    
    // Move current image out
    profileImages[currentImageIndex].style.transform = `translateX(${diff}px) translateY(0px) scale(${1.1 - progress * 0.1})`;
    profileImages[currentImageIndex].style.zIndex = '4';
    
    // Bring previous image forward
    profileImages[prevIndex].style.transform = `translateX(${diff - threshold}px) translateY(0px) scale(${1 + progress * 0.1})`;
    profileImages[prevIndex].style.zIndex = '5';
    
    // Keep other image in back
    const otherIndex = (currentImageIndex + 1) % profileImages.length;
    profileImages[otherIndex].style.transform = 'translateX(-20px) translateY(-10px) scale(0.9)';
    profileImages[otherIndex].style.zIndex = '2';
    
  } else {
    // Dragging left - bring next image forward
    const nextIndex = (currentImageIndex + 1) % profileImages.length;
    
    // Move current image out
    profileImages[currentImageIndex].style.transform = `translateX(${diff}px) translateY(0px) scale(${1.1 - progress * 0.1})`;
    profileImages[currentImageIndex].style.zIndex = '4';
    
    // Bring next image forward
    profileImages[nextIndex].style.transform = `translateX(${diff + threshold}px) translateY(0px) scale(${1 + progress * 0.1})`;
    profileImages[nextIndex].style.zIndex = '5';
    
    // Keep other image in back
    const otherIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
    profileImages[otherIndex].style.transform = 'translateX(-20px) translateY(-10px) scale(0.9)';
    profileImages[otherIndex].style.zIndex = '2';
  }
}

function endDrag() {
  if (!isDragging) return;
  
  isDragging = false;
  const diff = currentX - startX;
  const threshold = 100;
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Dragged right - previous image
      const nextIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
      bringImageToFront(nextIndex);
    } else {
      // Dragged left - next image
      const nextIndex = (currentImageIndex + 1) % profileImages.length;
      bringImageToFront(nextIndex);
    }
  } else {
    // Reset all images to their original positions
    bringImageToFront(currentImageIndex);
  }
  
  // Restart auto-play after drag interaction
  setTimeout(startAutoPlay, 3000);
  
  // Remove event listeners
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchend', endDrag);
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize active nav link
  updateActiveNavLink();
  
  // Set background images for project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const img = card.querySelector('img');
    if (img && img.src) {
      card.style.backgroundImage = `url('${img.src}')`;
    }
  });
  
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('animated');
    }, 100);
  }

  // Contact form functionality
  const contactForm = document.getElementById('bento-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted!');
      
      // Get form data
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      console.log('Form data:', { name, email, message });
      
      // Validate form
      if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
      submitButton.style.cursor = 'not-allowed';
      
      // Create mailto link with form data
      const subject = 'Portfolio Contact Form - Message from ' + name;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      
      const mailtoLink = `mailto:jcpaulite@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Show success notification
      showNotification('Opening email client...', 'success');
      
      // Open email client - simplified and more reliable method
      setTimeout(() => {
        // Create a temporary link element (most reliable method)
        const tempLink = document.createElement('a');
        tempLink.href = mailtoLink;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
              // Fallback method
      setTimeout(() => {
        try {
          window.location.href = mailtoLink;
        } catch (error) {
          console.error('Error opening email:', error);
          // Copy email to clipboard as fallback
          navigator.clipboard.writeText('jcpaulite@gmail.com').then(() => {
            showNotification('Email copied to clipboard: jcpaulite@gmail.com', 'info');
          }).catch(() => {
            showNotification('Please copy this email: jcpaulite@gmail.com', 'info');
          });
        }
      }, 1000);
      }, 500);
      
      // Reset form and button
      setTimeout(() => {
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        
        // Reset floating labels
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          input.classList.remove('has-content');
        });
      }, 1000);
    });
  }
  
  // Floating label functionality
  const formInputs = document.querySelectorAll('#bento-contact-form input, #bento-contact-form textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      if (this.value.trim() !== '') {
        this.classList.add('has-content');
      } else {
        this.classList.remove('has-content');
      }
    });
    
    input.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        this.classList.add('has-content');
      } else {
        this.classList.remove('has-content');
      }
    });
  });
  
  // Test email functionality (for debugging)
  console.log('Contact form initialized');
  console.log('Form element:', contactForm);
  console.log('Submit button:', contactForm ? contactForm.querySelector('button[type="submit"]') : 'Not found');
  
  // Add click event to submit button for debugging
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      console.log('Submit button found, adding click listener');
      submitBtn.addEventListener('click', function(e) {
        console.log('Submit button clicked!');
      });
    }
  }
  
  // Test button functionality
  const testButton = document.getElementById('test-email-btn');
  if (testButton) {
    testButton.addEventListener('click', function() {
      console.log('Test button clicked!');
      showNotification('Testing notification system...', 'info');
      
      setTimeout(() => {
        const testMailto = 'mailto:jcpaulite@gmail.com?subject=Test Email&body=This is a test email from your portfolio contact form.';
        showNotification('Testing email functionality...', 'info');
        
        setTimeout(() => {
          // Use the same reliable method as the main form
          const tempLink = document.createElement('a');
          tempLink.href = testMailto;
          tempLink.style.display = 'none';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          
          showNotification('Test email link opened!', 'success');
        }, 500);
      }, 1000);
    });
  }

  // Accordion for experience section
  const expHeaders = document.querySelectorAll('.exp-header');
  expHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const card = this.closest('.experience-card');
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.experience-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });

  // Trendy accordion for experience section (with accent color)
  document.querySelectorAll('.exp-header-row, .exp-chevron').forEach(el => {
    el.addEventListener('click', function(e) {
      const card = this.closest('.exp-card-trendy');
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.exp-card-trendy').forEach(c => {
        c.classList.remove('active');
        c.style.removeProperty('--accent1');
        c.style.removeProperty('--accent2');
      });
      if (!isActive) {
        card.classList.add('active');
        // Set accent colors from data-accent
        const accent = card.getAttribute('data-accent');
        if (accent) {
          const [a1, a2] = accent.split(',');
          card.style.setProperty('--accent1', a1.trim());
          card.style.setProperty('--accent2', a2.trim());
        }
      }
    });
  });
});

// Parallax hover effect for experience cards
function setupExpCardParallax() {
  if (window.innerWidth <= 900) return;
  document.querySelectorAll('.exp-card-creative').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = ((x / rect.width) - 0.5) * 32; // max 16px left/right
      const py = ((y / rect.height) - 0.5) * 32; // max 16px up/down
      card.style.setProperty('--parallax-x', px + 'px');
      card.style.setProperty('--parallax-y', py + 'px');
    });
    card.addEventListener('mouseleave', function() {
      card.style.setProperty('--parallax-x', '0px');
      card.style.setProperty('--parallax-y', '0px');
    });
  });
}
window.addEventListener('DOMContentLoaded', setupExpCardParallax);
window.addEventListener('resize', setupExpCardParallax);

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-family: 'Arial', sans-serif;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
} 