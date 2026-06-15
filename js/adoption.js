// Gomantak Gausevak Mahasang - Adoption JavaScript

let selectedCow = '';
let selectedCowAge = '';
let selectedCowHealth = '';
let selectedAdoptionAmount = 0;

function openAdoptModal(cowName, cowAge, cowHealth) {
    selectedCow = cowName;
    selectedCowAge = cowAge;
    selectedCowHealth = cowHealth;

    document.getElementById('modalCowName').textContent = cowName;
    document.getElementById('modalCowDetails').textContent = cowAge + ' • ' + cowHealth;
    document.getElementById('adoptModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset form
    document.getElementById('adoptionForm').reset();
    document.querySelectorAll('.amount-select').forEach(btn => btn.classList.remove('active'));
    selectedAdoptionAmount = 0;
    document.querySelectorAll('[id^="adopt"][id$="Error"]').forEach(el => el.classList.add('hidden'));
}

function closeAdoptModal() {
    document.getElementById('adoptModal').classList.remove('active');
    document.body.style.overflow = '';
}

function selectAdoptionAmount(amount) {
    selectedAdoptionAmount = amount;
    document.querySelectorAll('.amount-select').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('selectedAdoptionAmount').value = amount;
    document.getElementById('adoptAmountError').classList.add('hidden');
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('adoptModal');
    if (e.target === modal) {
        closeAdoptModal();
    }
});

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adoptionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let valid = true;

            // Reset errors
            document.querySelectorAll('[id^="adopt"][id$="Error"]').forEach(el => el.classList.add('hidden'));

            // Validate name
            const name = document.getElementById('adoptName');
            if (!name.value.trim() || name.value.trim().length < 2) {
                document.getElementById('adoptNameError').classList.remove('hidden');
                valid = false;
            }

            // Validate email
            const email = document.getElementById('adoptEmail');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById('adoptEmailError').classList.remove('hidden');
                valid = false;
            }

            // Validate phone
            const phone = document.getElementById('adoptPhone');
            const phoneRegex = /^[+]?[0-9\s-]{10,}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                document.getElementById('adoptPhoneError').classList.remove('hidden');
                valid = false;
            }

            // Validate address
            const address = document.getElementById('adoptAddress');
            if (!address.value.trim() || address.value.trim().length < 10) {
                document.getElementById('adoptAddressError').classList.remove('hidden');
                valid = false;
            }

            // Validate amount
            if (selectedAdoptionAmount <= 0) {
                document.getElementById('adoptAmountError').classList.remove('hidden');
                valid = false;
            }

            if (!valid) return;

            // Show loading
            const spinner = document.getElementById('adoptSpinner');
            const icon = document.getElementById('adoptIcon');
            spinner.classList.remove('hidden');
            icon.classList.add('hidden');

            // Prepare data
            const data = {
                cowName: selectedCow,
                cowAge: selectedCowAge,
                cowHealth: selectedCowHealth,
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                address: address.value.trim(),
                monthlyAmount: selectedAdoptionAmount,
                message: document.getElementById('adoptMessage').value.trim()
            };

            // Simulate API call
            setTimeout(() => {
                storeSubmission('adoption', data);

                spinner.classList.add('hidden');
                icon.classList.remove('hidden');

                closeAdoptModal();
                showToast('Adoption Request Submitted!', 'We will contact you shortly to complete the process.');

                // Reset form
                form.reset();
                document.querySelectorAll('.amount-select').forEach(btn => btn.classList.remove('active'));
                selectedAdoptionAmount = 0;
            }, 1500);
        });
    }
});
