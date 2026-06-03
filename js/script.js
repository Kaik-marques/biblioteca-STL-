document.addEventListener('DOMContentLoaded', () => {
    // Scroll suave manual para links âncora (Efeito de Âncora Garantido)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 60;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1200; // 1.2 segundos para um efeito de 'puxada' perceptível
                let start = null;

                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Função de atenuação (easeInOutCubic)
                    const easing = percentage < 0.5 
                        ? 4 * percentage * percentage * percentage 
                        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                });
            }
        });
    });

    // Intersection Observer para animações de revelação (Multidirecional e Escalonado)
    const revealElements = document.querySelectorAll('.feature-item, .collection-category, .step-card, .price-card, .bonus-card, .advantage-card, .video-wrap, .reveal-trigger, .faq-item, .immediate-access-banner, .pain-item, .timeline-step, .process-step-card, .subheadline-box, .pain-solution');


    
    const revealOptions = {
        threshold: 0.05, // Disparar um pouco mais cedo para uma melhor sensação no mobile
        rootMargin: "0px 0px -30px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Adicionar um pequeno atraso se vários itens forem vistos ao mesmo tempo (efeito escalonado)
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 100); 
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach((el) => {
        el.classList.add('reveal');
        
        // Lógica de escalonamento para filhos de grids
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('features-grid') || parent.classList.contains('bonus-grid') || parent.classList.contains('advantages-grid') || parent.classList.contains('pain-grid') || parent.classList.contains('timeline-grid') || parent.classList.contains('process-steps-grid'))) {

            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.1}s`;
        }

        if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal-up');
        }
        revealObserver.observe(el);
    });

    // Alternar FAQ (FAQ Toggle)
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');
            
            // Fechar outros itens
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('.faq-question svg');
                    if (otherAnswer.style.display === 'block') {
                        otherAnswer.style.display = 'none';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Alternar item atual
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Lógica do CTA Fixo para mobile (Sticky CTA)
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            // Mostrar CTA fixo após rolar o hero (aprox 600px)
            if (window.scrollY > 600) {
                stickyCta.classList.add('active');
            } else {
                stickyCta.classList.remove('active');
            }
        });
    }

    // Lógica do Cronômetro de Contagem Regressiva
    function startCountdown() {
        const timerElement = document.getElementById('countdown');
        if (!timerElement) return;

        function updateTimer() {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay - now;

            if (diff <= 0) {
                timerElement.innerHTML = "00:00:00";
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            const timerNums = timerElement.querySelectorAll('.timer-num');
            if (timerNums.length === 3) {
                timerNums[0].textContent = h.toString().padStart(2, '0');
                timerNums[1].textContent = m.toString().padStart(2, '0');
                timerNums[2].textContent = s.toString().padStart(2, '0');
            } else {
                timerElement.innerHTML = 
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    startCountdown();

    // Sistema de Notificação de Vendas
    const salesData = [
        "Carlos M. - Recife, PE",
        "Ana P. - São Paulo, SP",
        "Marcos R. - Curitiba, PR",
        "Juliana S. - Belo Horizonte, MG",
        "Felipe T. - Salvador, BA",
        "Ricardo G. - Porto Alegre, RS",
        "Maria L. - Brasília, DF",
        "Eduardo X. - Campinas, SP",
        "Beatriz C. - Fortaleza, CE",
        "Thiago O. - Manaus, AM"
    ];

    const notification = document.getElementById('sale-notification');
    const saleName = document.getElementById('sale-name');
    const saleClose = document.getElementById('sale-close');

    function showNotification() {
        if (!notification) return;
        
        const randomSale = salesData[Math.floor(Math.random() * salesData.length)];
        saleName.textContent = randomSale;
        
        notification.classList.add('active');
        
        // Esconder após 6 segundos
        setTimeout(() => {
            notification.classList.remove('active');
        }, 6000);
    }

    if (saleClose) {
        saleClose.addEventListener('click', () => {
            notification.classList.remove('active');
        });
    }

    // Atraso inicial e então mostrar a cada 30 segundos
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 30000);
    }, 5000);



    // Inicialização do Swiper
    const swiperOptions = {
        loop: true,
        speed: 8000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        slidesPerView: 'auto',
        spaceBetween: 20,
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 1,
            momentumVelocityRatio: 1,
        },
        grabCursor: true,
        allowTouchMove: true,
        // Efeito contínuo
        resistance: false,
        breakpoints: {
            320: { spaceBetween: 15 },
            768: { spaceBetween: 20 }
        }
    };

    // Carrosséis normais
    new Swiper('.car-swiper', swiperOptions);

    // Carrosséis invertidos
    new Swiper('.car-swiper-reverse', {
        ...swiperOptions,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
        },
    });

    // Carrossel de Provas Sociais
    new Swiper('.social-proof-swiper', {
        loop: true,
        speed: 500,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 20,
        grabCursor: true,
        pagination: {
            el: '.social-proof-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true,
            },
            480: {
                slidesPerView: 1.5,
                spaceBetween: 15,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
                centeredSlides: true,
            },
            1024: {
                slidesPerView: 3.5,
                spaceBetween: 25,
                centeredSlides: true,
            }
        }
    });
});

// --- SIMULADOR DE GANHOS LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const simTitle = document.getElementById('sim-title');
    const step1Btns = document.querySelectorAll('#sim-step-1 .sim-question:first-child .sim-btn');
    const step2Btns = document.querySelectorAll('#q2-container .sim-btn');
    const q2Container = document.getElementById('q2-container');
    const simCalculator = document.getElementById('sim-calculator');
    
    const sliderPecas = document.getElementById('slider-pecas');
    const sliderPreco = document.getElementById('slider-preco');
    const valPecas = document.getElementById('val-pecas');
    const valPreco = document.getElementById('val-preco');
    
    const resFaturamento = document.getElementById('res-faturamento');
    const resCusto = document.getElementById('res-custo');
    const resLucro = document.getElementById('res-lucro');
    const resRecupera = document.getElementById('res-recupera');
    const ctaVal = document.getElementById('cta-val');
    const simTestimonial = document.getElementById('sim-testimonial');

    if(!simTitle) return; // guard if not on page

    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    let profileType = '';
    let profileTime = '';

    // Step 1: Type Selection
    step1Btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            step1Btns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            profileType = e.target.getAttribute('data-type');
            
            // Update Title Context
            if(profileType === 'ja-vendo') simTitle.innerHTML = 'Veja quanto mais você pode <span class="accent-text">faturar</span>';
            else if(profileType === 'quero-comecar') simTitle.innerHTML = 'Veja quanto você pode faturar <span class="accent-text">começando do zero</span>';
            else simTitle.innerHTML = 'E se você <span class="accent-text">monetizasse</span> o que já imprime?';

            // Show Q2
            q2Container.style.display = 'block';
            setTimeout(() => q2Container.style.opacity = '1', 10);
        });
    });

    // Step 2: Time Selection
    step2Btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            step2Btns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            profileTime = e.target.getAttribute('data-time');
            
            // Set initial slider values based on time
            if(profileTime === 'pouco') sliderPecas.value = 5;
            else if(profileTime === 'medio') sliderPecas.value = 10;
            else sliderPecas.value = 20;

            updateCalculator();

            // Show Calculator
            simCalculator.style.display = 'block';
            
            // Hide questions gently
            document.getElementById('sim-step-1').style.display = 'none';
        });
    });

    // Slider Listeners
    if(sliderPecas && sliderPreco) {
        sliderPecas.addEventListener('input', updateCalculator);
        sliderPreco.addEventListener('input', updateCalculator);
    }

    function updateCalculator() {
        const pecas = parseInt(sliderPecas.value);
        const preco = parseInt(sliderPreco.value);
        
        valPecas.textContent = pecas;
        valPreco.textContent = `R$ ${preco}`;

        // Math: 4 weeks a month
        const faturamento = pecas * preco * 4;
        
        const custoFilamento = pecas * 3 * 4; // R$3 per piece
        const custoProduto = 27.90; // Fixed cost of the library
        const custoEnergia = pecas * 1 * 4; // R$1 per piece energy
        
        const lucro = faturamento - custoFilamento - custoProduto - custoEnergia;

        resFaturamento.textContent = formatter.format(faturamento);
        resCusto.textContent = `- ${formatter.format(custoFilamento)}`;
        
        const resCustoTaxa = document.getElementById('res-custo-taxa');
        if (resCustoTaxa) resCustoTaxa.textContent = `- R$ 27,90`;
        
        const resCustoEnergia = document.getElementById('res-custo-energia');
        if (resCustoEnergia) resCustoEnergia.textContent = `- ${formatter.format(custoEnergia)}`;
        
        resLucro.innerHTML = `${formatter.format(lucro)} <small>/mês</small>`;
        ctaVal.textContent = formatter.format(lucro);

        // Break-even
        const lucroPorPeca = preco - 3 - (preco * 0.10) - 1;
        const numPiecesToRecover = Math.max(1, Math.ceil(27.90 / lucroPorPeca));
        resRecupera.textContent = `Recuperado em apenas ${numPiecesToRecover} peça${numPiecesToRecover > 1 ? 's vendidas' : ' vendida'}!`;
    }
});

// Scroll Reveal Animations
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach((el) => {
        observer.observe(el);
    });
});
