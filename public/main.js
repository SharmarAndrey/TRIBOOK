document.addEventListener('DOMContentLoaded', () => {
	// Dark Mode Toggle
	const toggleSwitch = document.getElementById('darkModeToggle');
	const body = document.body;

	// Initialize dark mode based on previous setting
	if (localStorage.getItem('darkMode') === 'enabled') {
		body.classList.add('dark-mode');
	}

	toggleSwitch.addEventListener('click', () => {
		body.classList.toggle('dark-mode');
		if (body.classList.contains('dark-mode')) {
			localStorage.setItem('darkMode', 'enabled');
		} else {
			localStorage.removeItem('darkMode');
		}
	});

	// Lazy Loading for images
	const lazyImages = document.querySelectorAll('.lazy');
	const observer = new IntersectionObserver((entries, self) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.classList.remove('lazy');
				self.unobserve(img);
			}
		});
	});

	lazyImages.forEach(image => observer.observe(image));

	// Modal Functionality
	const modalButtons = document.querySelectorAll('.view-details-btn');
	modalButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const modal = new bootstrap.Modal(document.getElementById('apartmentModal'));
			modal.show();
		});
	});

	// Intersection Observer for Fade-in Cards
	const cards = document.querySelectorAll('.fade-in-card');
	const fadeInObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	});

	cards.forEach(card => fadeInObserver.observe(card));
});
