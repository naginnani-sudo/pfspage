// ============================
// EMI CALCULATOR FUNCTIONS
// ============================

// Sync input and range slider
document.addEventListener('DOMContentLoaded', function() {
    const loanAmount = document.getElementById('loanAmount');
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const interestRate = document.getElementById('interestRate');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const loanTenure = document.getElementById('loanTenure');
    const loanTenureSlider = document.getElementById('loanTenureSlider');

    if (loanAmount && loanAmountSlider) {
        loanAmount.addEventListener('input', function() {
            loanAmountSlider.value = this.value;
            calculateEMI();
        });

        loanAmountSlider.addEventListener('input', function() {
            loanAmount.value = this.value;
            calculateEMI();
        });
    }

    if (interestRate && interestRateSlider) {
        interestRate.addEventListener('input', function() {
            interestRateSlider.value = this.value;
            calculateEMI();
        });

        interestRateSlider.addEventListener('input', function() {
            interestRate.value = this.value;
            calculateEMI();
        });
    }

    if (loanTenure && loanTenureSlider) {
        loanTenure.addEventListener('input', function() {
            loanTenureSlider.value = this.value;
            calculateEMI();
        });

        loanTenureSlider.addEventListener('input', function() {
            loanTenure.value = this.value;
            calculateEMI();
        });
    }

    // Initial calculation
    calculateEMI();

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const months = parseFloat(document.getElementById('loanTenure').value) || 0;

    if (principal <= 0 || annualRate < 0 || months <= 0) {
        document.getElementById('emiAmount').textContent = '₹0';
        document.getElementById('totalAmount').textContent = '₹0';
        document.getElementById('totalInterest').textContent = '₹0';
        document.getElementById('principalAmount').textContent = '₹' + formatCurrency(principal);
        return;
    }

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = annualRate / 12 / 100;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    const emi = numerator / denominator;

    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;

    // Display results
    document.getElementById('emiAmount').textContent = '₹' + formatCurrency(emi);
    document.getElementById('totalAmount').textContent = '₹' + formatCurrency(totalPayable);
    document.getElementById('totalInterest').textContent = '₹' + formatCurrency(totalInterest);
    document.getElementById('principalAmount').textContent = '₹' + formatCurrency(principal);

    // Generate amortization schedule
    generateAmortizationSchedule(principal, monthlyRate, emi, months);
}

function formatCurrency(num) {
    return Math.round(num).toLocaleString('en-IN');
}

function resetCalculator() {
    document.getElementById('loanAmount').value = 500000;
    document.getElementById('loanAmountSlider').value = 500000;
    document.getElementById('interestRate').value = 8.5;
    document.getElementById('interestRateSlider').value = 8.5;
    document.getElementById('loanTenure').value = 60;
    document.getElementById('loanTenureSlider').value = 60;
    document.getElementById('loanProduct').value = '';
    calculateEMI();
}

function generateAmortizationSchedule(principal, monthlyRate, emi, months) {
    const scheduleBody = document.getElementById('scheduleBody');
    if (!scheduleBody) return;

    scheduleBody.innerHTML = '';
    let balance = principal;

    for (let i = 1; i <= months && i <= 120; i++) { // Show first 120 months max
        const interest = balance * monthlyRate;
        const principalPayment = emi - interest;
        balance -= principalPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>₹${formatCurrency(emi)}</td>
            <td>₹${formatCurrency(principalPayment)}</td>
            <td>₹${formatCurrency(interest)}</td>
            <td>₹${formatCurrency(Math.max(0, balance))}</td>
        `;
        scheduleBody.appendChild(row);
    }
}

function toggleAmortization() {
    const table = document.getElementById('amortizationTable');
    if (table) {
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
    }
}

function applyNow() {
    // Redirect to contact form
    window.location.href = 'contact.html#contactForm';
}

// ============================
// CONTACT FORM HANDLING
// ============================

function handleContactForm(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        product: document.getElementById('product').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };

    // Store in localStorage (for demo purposes)
    let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    submissions.push(formData);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    // Show success message
    alert('Thank you for your message! Our team will contact you soon.');
    document.getElementById('contactForm').reset();
}

// ============================
// NAVIGATION ACTIVE STATE
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-links a');

    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation.split('/').pop() || 
            (currentLocation === '/' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================

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

// ============================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all product cards and testimonial cards
document.querySelectorAll('.product-card, .testimonial-card, .founder-card, .benefit-item').forEach(el => {
    observer.observe(el);
});
