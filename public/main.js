document.addEventListener('DOMContentLoaded', () => {
	// Dark Mode Toggle
	const toggleSwitch = document.getElementById('darkModeToggle');
	const body = document.body;
	const darkModeIcon = toggleSwitch.querySelector('i');

	// Initialize dark mode based on previous setting
	if (localStorage.getItem('darkMode') === 'enabled') {
		body.classList.add('dark-mode');
		darkModeIcon.classList.remove('fa-moon');
		darkModeIcon.classList.add('fa-sun');
	}

	toggleSwitch.addEventListener('click', () => {
		body.classList.toggle('dark-mode');
		if (body.classList.contains('dark-mode')) {
			localStorage.setItem('darkMode', 'enabled');
			darkModeIcon.classList.remove('fa-moon');
			darkModeIcon.classList.add('fa-sun');
		} else {
			localStorage.removeItem('darkMode');
			darkModeIcon.classList.remove('fa-sun');
			darkModeIcon.classList.add('fa-moon');
		}
	});

	// Fetch cities based on selected province
	document.getElementById('province').addEventListener('change', function () {
		const province = this.value;
		const citySelect = document.getElementById('city');
		citySelect.disabled = true;
		citySelect.innerHTML = '<option value="">Loading...</option>';

		if (province) {
			fetch(`/getCities?province=${province}`)
				.then(response => response.json())
				.then(data => {
					citySelect.innerHTML = '<option value="">Select City</option>';
					data.cities.forEach(city => {
						const option = document.createElement('option');
						option.value = city;
						option.textContent = city;
						citySelect.appendChild(option);
					});
					citySelect.disabled = false;
				})
				.catch(err => {
					citySelect.innerHTML = '<option value="">Error loading cities</option>';
				});
		} else {
			citySelect.innerHTML = '<option value="">Select City</option>';
			citySelect.disabled = true;
		}
	});

	// Lazy Loading for images
	const lazyImages = document.querySelectorAll('.card-img-top');
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const imgDiv = entry.target;
				const imageUrl = imgDiv.style.backgroundImage.slice(5, -2);
				const img = new Image();
				img.src = imageUrl;
				img.onload = () => {
					imgDiv.style.backgroundImage = `url('${imageUrl}')`;
					observer.unobserve(imgDiv);
				};
			}
		});
	});

	lazyImages.forEach(image => imageObserver.observe(image));

	// Intersection Observer for Fade-in Cards
	const cards = document.querySelectorAll('.fade-in-card');
	const cardObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1
	});

	cards.forEach(card => cardObserver.observe(card));
});
