document.addEventListener('DOMContentLoaded', () => {
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
});
