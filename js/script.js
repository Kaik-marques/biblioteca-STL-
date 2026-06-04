/* ============================================================
   BIBLIOTECA SETUP MASTER 3D — script.js
   Animações de scroll + performance + interações
   ============================================================ */

/* ----------------------------------------------------------
   1. SISTEMA DE ANIMAÇÕES DE SCROLL (IntersectionObserver)
   ---------------------------------------------------------- */
(function initScrollAnimations() {
  const ANIMATION_CONFIG = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    staggerDelay: 100, // ms entre filhos de grid
  };

  // Garante que elementos sem opacidade já aplicada não "piscam"
  function setupElement(el) {
    el.style.willChange = 'transform, opacity';
    // Aplica delay escalonado via inline style (lido antes do observer disparar)
    const delay = parseInt(el.dataset.delay || '0', 10);
    if (delay > 0) {
      el.style.transitionDelay = delay + 'ms';
    }
  }

  function activateElement(el, delay = 0) {
    setTimeout(() => {
      el.classList.add('active');
      // Limpa will-change após animação para economizar memória
      el.addEventListener('transitionend', () => {
        el.style.willChange = 'auto';
      }, { once: true });
    }, delay);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      activateElement(el, delay);
      obs.unobserve(el);
    });
  }, {
    threshold: ANIMATION_CONFIG.threshold,
    rootMargin: ANIMATION_CONFIG.rootMargin,
  });

  function registerElements() {
    // Todos os elementos com classes de reveal
    const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

    elements.forEach(el => {
      setupElement(el);
      observer.observe(el);
    });

    // Stagger automático em grids
    const grids = document.querySelectorAll(
      '.advantages-grid, .bonus-grid, .process-steps-grid, .ideal-grid, .masonry-grid, .testimonials-grid'
    );

    grids.forEach(grid => {
      const children = grid.querySelectorAll('.advantage-card, .bonus-card, .process-step-card, .ideal-card, .masonry-item, .testimonial-card');
      children.forEach((child, i) => {
        const delay = i * ANIMATION_CONFIG.staggerDelay;
        child.dataset.delay = delay;
        // Adiciona classe de animação se não tiver
        if (!child.classList.contains('reveal-up') && !child.classList.contains('reveal-left') && !child.classList.contains('reveal-right')) {
          child.classList.add('reveal-up');
        }
        setupElement(child);
        observer.observe(child);
      });
    });

    // Collection cards com direção alternada
    document.querySelectorAll('.collection-card').forEach((card, i) => {
      if (!card.classList.contains('reveal-left') && !card.classList.contains('reveal-right')) {
        card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      }
      card.dataset.delay = i * 80;
      setupElement(card);
      observer.observe(card);
    });

    // Seções inteiras com fade suave
    document.querySelectorAll('.pain-hero, .value-stack-wrapper, .guarantee-box, .investment-copy, .pix-discount-banner, .price-card').forEach((el, i) => {
      if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-fade')) {
        el.classList.add('reveal-fade');
      }
      el.dataset.delay = i * 60;
      setupElement(el);
      observer.observe(el);
    });

    // FAQ items escalonados
    document.querySelectorAll('.faq-item').forEach((item, i) => {
      if (!item.classList.contains('reveal-up')) item.classList.add('reveal-up');
      item.dataset.delay = i * 70;
      setupElement(item);
      observer.observe(item);
    });

    // Testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card, i) => {
      if (!card.classList.contains('reveal-up')) card.classList.add('reveal-up');
      card.dataset.delay = i * 80;
      setupElement(card);
      observer.observe(card);
    });

    // Process step cards
    document.querySelectorAll('.process-step-card').forEach((card, i) => {
      const dirs = ['reveal-left', 'reveal-up', 'reveal-right'];
      if (!card.classList.contains('reveal-left') && !card.classList.contains('reveal-right') && !card.classList.contains('reveal-up')) {
        card.classList.add(dirs[i % 3]);
      }
      card.dataset.delay = i * 120;
      setupElement(card);
      observer.observe(card);
    });

    // Seções de identificação e curiosidade inseridas
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade').forEach(el => {
      setupElement(el);
      if (!el._observed) {
        observer.observe(el);
        el._observed = true;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerElements);
  } else {
    registerElements();
  }
})();


/* ----------------------------------------------------------
   2. SCROLL SUAVE PARA ÂNCORAS
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 60;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start = null;

      window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const easing = percentage < 0.5
          ? 4 * percentage * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
        window.scrollTo(0, startPosition + distance * easing);
        if (progress < duration) window.requestAnimationFrame(step);
      });
    });
  });
});


/* ----------------------------------------------------------
   3. INICIALIZAÇÃO PRINCIPAL (DOMContentLoaded)
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* --- FAQ Toggle --- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const icon = question.querySelector('svg');

      // Fechar outros
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          const otherAnswer = item.querySelector('.faq-answer');
          const otherIcon = item.querySelector('.faq-question svg');
          if (otherAnswer && otherAnswer.style.display === 'block') {
            otherAnswer.style.display = 'none';
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Toggle atual
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answer.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });


  /* --- Countdown Timer --- */
  function startCountdown() {
    const timerElement = document.getElementById('countdown');
    if (!timerElement) return;

    function updateTimer() {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      if (diff <= 0) {
        timerElement.innerHTML = '00:00:00';
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const nums = timerElement.querySelectorAll('.timer-num');
      if (nums.length === 3) {
        nums[0].textContent = String(h).padStart(2, '0');
        nums[1].textContent = String(m).padStart(2, '0');
        nums[2].textContent = String(s).padStart(2, '0');
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  startCountdown();


  /* --- Notificações de Venda --- */
  const salesData = [
    'Carlos M. — Recife, PE',
    'Ana P. — São Paulo, SP',
    'Marcos R. — Curitiba, PR',
    'Juliana S. — Belo Horizonte, MG',
    'Felipe T. — Salvador, BA',
    'Ricardo G. — Porto Alegre, RS',
    'Maria L. — Brasília, DF',
    'Eduardo X. — Campinas, SP',
    'Beatriz C. — Fortaleza, CE',
    'Thiago O. — Manaus, AM',
  ];

  const notification = document.getElementById('sale-notification');
  const saleName = document.getElementById('sale-name');
  const saleClose = document.getElementById('sale-close');

  function showNotification() {
    if (!notification || !saleName) return;
    saleName.textContent = salesData[Math.floor(Math.random() * salesData.length)];
    notification.classList.add('active');
    setTimeout(() => notification.classList.remove('active'), 6000);
  }

  if (saleClose) {
    saleClose.addEventListener('click', () => notification.classList.remove('active'));
  }

  setTimeout(() => {
    showNotification();
    setInterval(showNotification, 30000);
  }, 5000);


  /* --- Swiper Carrosséis --- */
  const swiperOptions = {
    loop: true,
    speed: 7000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    spaceBetween: 20,
    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 0.8,
    },
    grabCursor: true,
    allowTouchMove: true,
    resistance: false,
    breakpoints: {
      320: { spaceBetween: 12 },
      768: { spaceBetween: 20 },
    },
  };

  // Inicializa todos os carrosséis normais
  document.querySelectorAll('.car-swiper').forEach(el => {
    new Swiper(el, swiperOptions);
  });

  // Carrosséis reversos
  document.querySelectorAll('.car-swiper-reverse').forEach(el => {
    new Swiper(el, {
      ...swiperOptions,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
    });
  });

  // Carrossel de provas sociais (infinite marquee)
  document.querySelectorAll('.infinite-carousel.car-swiper').forEach(el => {
    // Já inicializado acima, skip se já tem swiper
  });

  // Slider de provas sociais com paginação
  const proofSwiper = document.querySelector('.social-proof-swiper');
  if (proofSwiper) {
    new Swiper(proofSwiper, {
      loop: true,
      speed: 500,
      autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 20,
      grabCursor: true,
      pagination: { el: '.social-proof-pagination', clickable: true },
      breakpoints: {
        320: { slidesPerView: 1.2, spaceBetween: 15, centeredSlides: true },
        480: { slidesPerView: 1.5, spaceBetween: 15, centeredSlides: true },
        768: { slidesPerView: 2.5, spaceBetween: 20, centeredSlides: true },
        1024: { slidesPerView: 3.5, spaceBetween: 25, centeredSlides: true },
      },
    });
  }


  /* --- Sticky CTA mobile --- */
  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      stickyCta.classList.toggle('active', window.scrollY > 600);
    }, { passive: true });
  }


  /* --- Progress bar de scroll (opcional, visual premium) --- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${(scrolled / maxScroll) * 100}%`;
    }, { passive: true });
  }


  /* --- Lazy load de vídeos (intersection observer) --- */
  const lazyVideos = document.querySelectorAll('video[data-src]');
  if (lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.dataset.src;
          video.load();
          obs.unobserve(video);
        }
      });
    }, { threshold: 0.1 });

    lazyVideos.forEach(video => videoObserver.observe(video));
  }


  /* --- Hover parallax suave no hero mockup --- */
  const heroMockup = document.querySelector('.main-mockup');
  const heroSection = document.querySelector('.hero');
  if (heroMockup && heroSection && window.matchMedia('(min-width: 768px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
      heroMockup.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      heroMockup.style.transform = '';
    }, { passive: true });
  }

});


/* ----------------------------------------------------------
   4. SIMULADOR DE GANHOS (se presente na página)
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const simTitle = document.getElementById('sim-title');
  if (!simTitle) return;

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

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  let profileType = '', profileTime = '';

  step1Btns.forEach(btn => {
    btn.addEventListener('click', e => {
      step1Btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      profileType = e.target.dataset.type;
      if (profileType === 'ja-vendo') simTitle.innerHTML = 'Veja quanto mais você pode <span class="accent-text">faturar</span>';
      else if (profileType === 'quero-comecar') simTitle.innerHTML = 'Veja quanto você pode faturar <span class="accent-text">começando do zero</span>';
      else simTitle.innerHTML = 'E se você <span class="accent-text">monetizasse</span> o que já imprime?';
      q2Container.style.display = 'block';
      setTimeout(() => q2Container.style.opacity = '1', 10);
    });
  });

  step2Btns.forEach(btn => {
    btn.addEventListener('click', e => {
      step2Btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      profileTime = e.target.dataset.time;
      if (profileTime === 'pouco') sliderPecas.value = 5;
      else if (profileTime === 'medio') sliderPecas.value = 10;
      else sliderPecas.value = 20;
      updateCalculator();
      simCalculator.style.display = 'block';
      document.getElementById('sim-step-1').style.display = 'none';
    });
  });

  if (sliderPecas && sliderPreco) {
    sliderPecas.addEventListener('input', updateCalculator);
    sliderPreco.addEventListener('input', updateCalculator);
  }

  function updateCalculator() {
    const pecas = parseInt(sliderPecas.value);
    const preco = parseInt(sliderPreco.value);
    valPecas.textContent = pecas;
    valPreco.textContent = `R$ ${preco}`;
    const faturamento = pecas * preco * 4;
    const custoFilamento = pecas * 3 * 4;
    const custoProduto = 27.90;
    const custoEnergia = pecas * 1 * 4;
    const lucro = faturamento - custoFilamento - custoProduto - custoEnergia;
    resFaturamento.textContent = formatter.format(faturamento);
    resCusto.textContent = `- ${formatter.format(custoFilamento)}`;
    const resCustoTaxa = document.getElementById('res-custo-taxa');
    if (resCustoTaxa) resCustoTaxa.textContent = '- R$ 27,90';
    const resCustoEnergia = document.getElementById('res-custo-energia');
    if (resCustoEnergia) resCustoEnergia.textContent = `- ${formatter.format(custoEnergia)}`;
    resLucro.innerHTML = `${formatter.format(lucro)} <small>/mês</small>`;
    if (ctaVal) ctaVal.textContent = formatter.format(lucro);
    const lucroPorPeca = preco - 3 - preco * 0.10 - 1;
    const numPieces = Math.max(1, Math.ceil(27.90 / lucroPorPeca));
    if (resRecupera) resRecupera.textContent = `Recuperado em apenas ${numPieces} peça${numPieces > 1 ? 's vendidas' : ' vendida'}!`;
  }
});
