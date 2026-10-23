document.addEventListener('DOMContentLoaded', () => {
    // 1. Ano Dinâmico no Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Dark Mode com LocalStorage
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // 3. Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
    });

    // 4. Intersection Observer para Animações de Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));

    // 5. Accordion FAQ
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fecha todos
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // Abre o clicado se não estava ativo
            if (!isActive) item.classList.add('active');
        });
    });

    // 6. Rastreamento de UTMs e Injeção no WhatsApp
    const urlParams = new URLSearchParams(window.location.search);
    let utmSource = urlParams.get('utm_source') || 'site_organico';
    let utmMedium = urlParams.get('utm_medium') || 'nao_definido';
    
    // Salva no LocalStorage para persistência
    if (utmSource !== 'site_organico') {
        localStorage.setItem('utm_source', utmSource);
        localStorage.setItem('utm_medium', utmMedium);
    } else {
        utmSource = localStorage.getItem('utm_source') || 'site_organico';
    }

    const baseWhatsAppMsg = `Olá! Vim pelo site (${utmSource}) e gostaria de fazer um pedido.`;
    const encodedMsg = encodeURIComponent(baseWhatsAppMsg);
    const whatsappNumber = '5511939592955';

    // Atualiza todos os links de WhatsApp no site
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    });

    // 7. Função de Pedido Rápido (Produtos)
    window.orderProduct = function(productName) {
        const msg = encodeURIComponent(`Olá! Vim pelo site e gostaria de pedir: ${productName}. Poderia me passar mais detalhes?`);
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
        trackEvent('whatsapp_click', { product: productName });
    };

    // 8. Formulário Inteligente (Fallback para WhatsApp/Mailto)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const mensagem = formData.get('mensagem');
            
            const finalMsg = encodeURIComponent(`*Novo Contato pelo Site*\n\n👤 Nome: ${nome}\n📱 Telefone: ${telefone}\n💬 Mensagem: ${mensagem}`);
            
            // Abre WhatsApp com os dados formatados
            window.open(`https://wa.me/${whatsappNumber}?text=${finalMsg}`, '_blank');
            
            // Limpa formulário e dá feedback
            contactForm.reset();
            alert('Obrigado! Redirecionando você para o WhatsApp para atendimento imediato.');
            trackEvent('form_submit', { method: 'whatsapp_redirect' });
        });
    }

    // 9. Banner de Cookies LGPD
    const cookieBanner = document.getElementById('cookie-banner');
    const hasConsent = localStorage.getItem('cookie_consent');

    if (!hasConsent) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
        // Aqui você dispararia os scripts de marketing se estivessem bloqueados
        trackEvent('cookie_consent', { status: 'accepted' });
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'rejected');
        cookieBanner.classList.remove('show');
        trackEvent('cookie_consent', { status: 'rejected' });
    });

    // 10. Função de Rastreamento (Mock para GTM/GA4)
    window.trackEvent = function(eventName, params = {}) {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === 'rejected') {
            console.log('Rastreamento bloqueado por LGPD');
            return;
        }
        
        // Dispara para o dataLayer do GTM/GA4
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({ event: eventName, ...params });
        }
        console.log(`[Track] ${eventName}`, params);
    };
});