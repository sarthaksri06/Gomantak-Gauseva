// Gomantak Gausevak Mahasang - Contact JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let valid = true;

            // Reset errors
            document.querySelectorAll('[id^="contact"][id$="Error"]').forEach(el => el.classList.add('hidden'));

            // Validate name
            const name = document.getElementById('contactName');
            if (!name.value.trim() || name.value.trim().length < 2) {
                document.getElementById('contactNameError').classList.remove('hidden');
                valid = false;
            }

            // Validate email
            const email = document.getElementById('contactEmail');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById('contactEmailError').classList.remove('hidden');
                valid = false;
            }

            // Validate subject
            const subject = document.getElementById('contactSubject');
            if (!subject.value) {
                document.getElementById('contactSubjectError').classList.remove('hidden');
                valid = false;
            }

            // Validate message
            const message = document.getElementById('contactMessage');
            if (!message.value.trim() || message.value.trim().length < 10) {
                document.getElementById('contactMessageError').classList.remove('hidden');
                valid = false;
            }

            if (!valid) return;

            // Show loading
            const spinner = document.getElementById('contactSpinner');
            const icon = document.getElementById('contactIcon');
            spinner.classList.remove('hidden');
            icon.classList.add('hidden');

            // Prepare data
            const data = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: subject.value,
                subjectLabel: subject.options[subject.selectedIndex].text,
                message: message.value.trim()
            };

            // Simulate API call
            setTimeout(() => {
                storeSubmission('contact', data);

                spinner.classList.add('hidden');
                icon.classList.remove('hidden');

                form.reset();
                showToast('Message Sent!', 'Thank you for reaching out. We will get back to you soon.');
            }, 1500);
        });
    }
});
