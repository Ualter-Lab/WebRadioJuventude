document.addEventListener("DOMContentLoaded", () => {
  const contacts = [
    {
      type: "community",
      phone: "5582991499935",
      message:
        "Olá! Gostaria de enviar uma notícia para a Web Rádio Juventude.",
      text: `Fale com a Web Rádio Juventude

A Web Rádio Juventude é um canal aberto para a comunidade e para as empresas da região.

Se você é morador e quer enviar uma notícia, denúncia, aviso ou sugestão de pauta, nossa redação está pronta para ouvir você.`,
    },
    {
      type: "business",
      phone: "5582993296626",
      message: "Olá! Tenho interesse em anunciar na Web Rádio Juventude.",
      text: `Fale com a Web Rádio Juventude

A Web Rádio Juventude é um canal aberto para a comunidade e para as empresas da região.

Se você tem uma empresa, serviço, evento ou campanha para divulgar, oferecemos espaços de publicidade para conectar sua marca com um público local, ativo e engajado.`,
    },
  ];

  const card = document.querySelector(".cardfale");
  const cardText = document.querySelector(".cardfale p");
  const previousButton = document.querySelector(".before");
  const nextButton = document.querySelector(".after");
  const whatsappButton = document.querySelector(".whatsapp");
  const advertiseButton = document.querySelector(".anuncie");
  const menuLinks = [...document.querySelectorAll(".taglink a")];
  const sections = menuLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let activeContact = 0;

  function formatContactText(text) {
    return text.trim().replace(/\n/g, "<br>");
  }

  function renderContact(direction = 1) {
    if (!card || !cardText) return;

    card.classList.add("is-changing");

    window.setTimeout(() => {
      const contact = contacts[activeContact];

      cardText.innerHTML = formatContactText(contact.text);
      card.classList.toggle("is-business", contact.type === "business");
      previousButton.classList.toggle(
        "is-business",
        contact.type === "business",
      );
      nextButton.classList.toggle("is-business", contact.type === "business");
      card.style.transform = `translateX(${direction * -10}px)`;

      window.requestAnimationFrame(() => {
        card.classList.remove("is-changing");
        card.style.transform = "";
      });
    }, 180);
  }

  function changeContact(step) {
    activeContact = (activeContact + step + contacts.length) % contacts.length;
    renderContact(step);
  }

  function openWhatsApp() {
    const contact = contacts[activeContact];
    const url = `https://wa.me/${contact.phone}?text=${encodeURIComponent(contact.message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function scrollToSection(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  previousButton?.addEventListener("click", () => changeContact(-1));
  nextButton?.addEventListener("click", () => changeContact(1));
  whatsappButton?.addEventListener("click", openWhatsApp);
  advertiseButton?.addEventListener("click", () => {
    activeContact = 1;
    renderContact(1);
    scrollToSection("#contato");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;
      event.preventDefault();
      scrollToSection(href);
    });
  });

  if ("IntersectionObserver" in window) {
    document
      .querySelectorAll(".card1, .card2")
      .forEach((item) => item.classList.add("is-visible"));

    const revealItems = document.querySelectorAll(
      ".card3, .letreiro, .card4, footer, .subcards > div",
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal");
      revealObserver.observe(item);
    });

    const menuObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          menuLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => menuObserver.observe(section));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((item) => item.classList.add("is-visible"));
  }

  renderContact();
});
