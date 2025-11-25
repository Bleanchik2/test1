document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    initializeBootstrapComponents();
    
    // Form submission
    const feedbackForm = document.getElementById('feedbackForm');
    
    // Phone input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        initializePhoneInput(phoneInput);
    }
    
    // Form submission handler
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

function initializeBootstrapComponents() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

function initializePhoneInput(phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            value = value.substring(1);
        }
        
        let formattedValue = '+7 (';
        
        if (value.length > 0) {
            formattedValue += value.substring(0, 3);
        }
        if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, 6);
        }
        if (value.length > 6) {
            formattedValue += '-' + value.substring(6, 8);
        }
        if (value.length > 8) {
            formattedValue += '-' + value.substring(8, 10);
        }
        
        e.target.value = formattedValue;
    });
    
    // Add validation styles
    phoneInput.addEventListener('blur', function() {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (this.value && !phoneRegex.test(this.value)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправка...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim()
    };
    
    // Simple validation
    if (!validateForm(formData)) {
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showSuccessMessage(formData.name);
        e.target.reset();
        resetSubmitButton(submitBtn, originalText);
        
        // Remove validation classes
        document.getElementById('name').classList.remove('is-valid');
        document.getElementById('phone').classList.remove('is-valid');
    }, 1500);
}

function validateForm(formData) {
    let isValid = true;
    
    // Name validation
    if (!formData.name || formData.name.length < 2) {
        showAlert('Пожалуйста, введите корректное имя', 'danger');
        document.getElementById('name').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('name').classList.remove('is-invalid');
        document.getElementById('name').classList.add('is-valid');
    }
    
    // Phone validation
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
        showAlert('Пожалуйста, введите корректный номер телефона', 'danger');
        document.getElementById('phone').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('phone').classList.remove('is-invalid');
        document.getElementById('phone').classList.add('is-valid');
    }
    
    return isValid;
}

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show alert-custom" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const form = document.getElementById('feedbackForm');
    form.insertAdjacentHTML('beforebegin', alertHtml);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            bootstrap.Alert.getOrCreateInstance(alert).close();
        }
    }, 5000);
}

function resetSubmitButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function showSuccessMessage(name) {
    const modalHtml = `
        <div class="modal fade" id="successModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <div class="text-success mb-3" style="font-size: 3rem;">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <h4 class="text-primary-custom mb-3">Спасибо, ${name}!</h4>
                        <p class="text-muted mb-4">Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут для подтверждения бронирования.</p>
                        <button type="button" class="btn btn-primary-custom px-4" data-bs-dismiss="modal">Понятно</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('successModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Remove modal from DOM after hide
    document.getElementById('successModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else {
                    entry.target.classList.add('fade-in');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.card, .feature-icon, .section-title');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initializeSmoothScrolling() {
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

// Utility functions
function debounce(func, wait) {
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

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeBootstrapComponents,
        initializePhoneInput,
        handleFormSubmit,
        validateForm
    };
}