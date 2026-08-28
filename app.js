document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('[data-target]');
    const sections = document.querySelectorAll('.section');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    const downloadSearchInput = document.getElementById('download-search-input');
    const downloadCards = document.querySelectorAll('.download-card');

    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    // 2. SPA Navigation System
    function navigateToSection(targetId) {
        // Hide all sections and remove active class
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active class on nav links
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // If mobile nav is open, close it
        navMenu.classList.remove('open');
        menuBtn.querySelector('i').className = 'fa-solid fa-bars';
    }

    // Nav Links Click Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navigateToSection(targetId);
            // Update URL hash
            window.location.hash = targetId;
        });
    });

    // Check URL Hash on Load
    const initialHash = window.location.hash.substring(1);
    const validSections = Array.from(sections).map(s => s.id);
    if (initialHash && validSections.includes(initialHash)) {
        navigateToSection(initialHash);
    }

    // 3. Mobile Menu Toggle
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        menuBtn.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // 4. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. Theme Toggle System (Light / Dark)
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });

    // 6. Product Grid Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Simple animation trigger
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 7. Downloads Live Search
    if (downloadSearchInput) {
        downloadSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            downloadCards.forEach(card => {
                const searchTags = card.getAttribute('data-name').toLowerCase();
                if (searchTags.includes(searchTerm)) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'fadeIn 0.3s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 8. Contact Form Handling (Simulation)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

            // Simulate API request delay
            setTimeout(() => {
                // Success simulator
                formFeedback.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formFeedback.className = 'form-feedback success';

                // Clear inputs
                contactForm.reset();

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                showToast('Mensagem enviada com sucesso! Entraremos em contato.');

                // Auto hide feedback after 5 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // 9. Direct WhatsApp Sender from Form
    const sendWhatsAppBtn = document.getElementById('send-whatsapp-direct');
    if (sendWhatsAppBtn && contactForm) {
        sendWhatsAppBtn.addEventListener('click', () => {
            const name = document.getElementById('name')?.value.trim() || 'Cliente';
            const phone = document.getElementById('phone')?.value.trim() || 'Não informado';
            const subject = document.getElementById('subject')?.value || 'Atendimento Geral';
            const message = document.getElementById('message')?.value.trim() || 'Olá! Gostaria de mais informações.';

            const text = `*Contato pelo Site - Roberto Computadores*%0A%0A` +
                         `*Nome:* ${encodeURIComponent(name)}%0A` +
                         `*Telefone:* ${encodeURIComponent(phone)}%0A` +
                         `*Assunto:* ${encodeURIComponent(subject)}%0A` +
                         `*Mensagem:* ${encodeURIComponent(message)}`;

            window.open(`https://wa.me/5516993416500?text=${text}`, '_blank');
        });
    }

    // 10. Copy Address to Clipboard
    const copyAddressBtn = document.getElementById('copy-address-btn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const addressText = 'Rua Dr. Matta, 467 - Sala 01 - Centro, Cajuru - SP, CEP 14240-000';
            navigator.clipboard.writeText(addressText).then(() => {
                const copyTextSpan = document.getElementById('copy-text');
                if (copyTextSpan) {
                    const originalText = copyTextSpan.textContent;
                    copyTextSpan.textContent = 'Copiado!';
                    showToast('Endereço copiado para a área de transferência!');
                    setTimeout(() => {
                        copyTextSpan.textContent = originalText;
                    }, 2500);
                }
            }).catch(() => {
                showToast('Endereço: Rua Dr. Matta, 467 - Centro, Cajuru - SP');
            });
        });
    }

    // 11. Toast Notification Helper
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
