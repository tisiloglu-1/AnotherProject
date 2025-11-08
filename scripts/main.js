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


