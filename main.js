// Scroll reveal
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    },
    { threshold: 0.15 },
);

document
    .querySelectorAll(".reveal")
    .forEach((el) => observer.observe(el));

// Add staggered delay to feature cards
document
    .querySelectorAll(".features-grid .feature-card")
    .forEach((card, i) => {
        card.style.transitionDelay = i * 0.08 + "s";
    });

document.querySelectorAll(".steps-grid .step").forEach((step, i) => {
    step.style.transitionDelay = i * 0.1 + "s";
});