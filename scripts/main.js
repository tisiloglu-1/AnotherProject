const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');
const chatWidget = document.querySelector('.chat-widget');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-panel-input');
const chatInput = document.querySelector('#chat-input');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('open');
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    });
  });
}

const toggleChatPanel = (isOpen) => {
  if (!chatPanel || !chatWidget) return;
  chatPanel.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) {
    chatInput?.focus();
  } else {
    chatWidget.focus();
  }
};

chatWidget?.addEventListener('click', () => {
  const isHidden = chatPanel?.getAttribute('aria-hidden') !== 'false';
  toggleChatPanel(isHidden);
});

chatClose?.addEventListener('click', () => toggleChatPanel(false));

chatPanel?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleChatPanel(false);
  }
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput?.value.trim();
  if (!value) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message user';
  userMessage.textContent = value;

  const reply = document.createElement('div');
  reply.className = 'chat-message bot';
  reply.innerHTML = `<strong>AURI:</strong> Thanks for your question! A specialist will follow up right away.`;

  const body = chatPanel?.querySelector('.chat-panel-body');
  body?.append(userMessage, reply);

  chatInput.value = '';
  body?.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
});

// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId.length > 1) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    }
  });
});

// Reduce header shadow on scroll for subtle feedback
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    const threshold = window.scrollY > 24;
    header.classList.toggle('scrolled', threshold);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Testimonials carousel
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialCards = testimonialTrack ? Array.from(testimonialTrack.querySelectorAll('.testimonial-card')) : [];
const testimonialPrev = document.querySelector('.testimonial-nav.prev');
const testimonialNext = document.querySelector('.testimonial-nav.next');
const testimonialIndicators = document.querySelector('.testimonial-indicators');

if (testimonialTrack && testimonialCards.length > 0) {
  let currentTestimonialIndex = 0;

  const ensureIndicators = () => {
    if (!testimonialIndicators) return;
    if (testimonialIndicators.children.length === testimonialCards.length) return;
    testimonialIndicators.innerHTML = '';
    testimonialCards.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'indicator';
      indicator.setAttribute('aria-label', `Show testimonial ${index + 1}`);
      indicator.setAttribute('role', 'tab');
      indicator.addEventListener('click', () => setActiveTestimonial(index));
      testimonialIndicators.appendChild(indicator);
    });
  };

  const updateIndicators = () => {
    if (!testimonialIndicators) return;
    testimonialIndicators.querySelectorAll('.indicator').forEach((btn, index) => {
      const isActive = index === currentTestimonialIndex;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  };

  const scrollToActiveCard = () => {
    const activeCard = testimonialCards[currentTestimonialIndex];
    if (!activeCard) return;
    const offset = Math.max(0, activeCard.offsetLeft - (testimonialTrack.clientWidth - activeCard.offsetWidth) / 2);
    testimonialTrack.scrollTo({ left: offset, behavior: 'smooth' });
  };

  const setActiveTestimonial = (index) => {
    currentTestimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    testimonialCards.forEach((card, cardIndex) => {
      card.classList.toggle('active', cardIndex === currentTestimonialIndex);
    });
    updateIndicators();
    scrollToActiveCard();
  };

  ensureIndicators();
  setActiveTestimonial(0);

  testimonialPrev?.addEventListener('click', () => {
    setActiveTestimonial(currentTestimonialIndex - 1);
  });

  testimonialNext?.addEventListener('click', () => {
    setActiveTestimonial(currentTestimonialIndex + 1);
  });

  testimonialTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveTestimonial(currentTestimonialIndex + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveTestimonial(currentTestimonialIndex - 1);
    }
  });

  window.addEventListener('resize', () => {
    scrollToActiveCard();
  });
}

const metricCards = document.querySelectorAll('.metric-card[data-metric]');
const metricModals = document.querySelectorAll('.metric-modal');
let lastFocusedElement = null;

const closeAllMetricModals = () => {
  metricModals.forEach((modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const openMetricModal = (id, trigger) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  closeAllMetricModals();
  lastFocusedElement = trigger;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const focusTarget = modal.querySelector('.metric-modal-close') || modal;
  focusTarget.focus();
};

metricCards.forEach((card) => {
  card.setAttribute('aria-haspopup', 'dialog');
  card.addEventListener('click', () => openMetricModal(card.dataset.metric, card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMetricModal(card.dataset.metric, card);
    }
  });
});

metricModals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeAllMetricModals();
    }
  });
  const closeButton = modal.querySelector('.metric-modal-close');
  closeButton?.addEventListener('click', closeAllMetricModals);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const isOpen = Array.from(metricModals).some((modal) => modal.classList.contains('open'));
    if (isOpen) {
      closeAllMetricModals();
    }
  }
});


