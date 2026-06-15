// Gomantak Gausevak Mahasang - Donation JavaScript

let selectedAmount = 0;
let selectedAmountBtn = null;

function selectAmount(amount) {
    const customDiv = document.getElementById('customAmountDiv');
    const amountDisplay = document.getElementById('selectedAmount');

    // Remove active from all buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (amount === 'custom') {
        customDiv.classList.remove('hidden');
        document.getElementById('customAmount').focus();
        selectedAmount = 0;
        amountDisplay.textContent = 'Rs.0';

        // Mark custom button active
        event.target.classList.add('active');
        selectedAmountBtn = event.target;
    } else {
        customDiv.classList.add('hidden');
        selectedAmount = amount;
        amountDisplay.textContent = 'Rs.' + amount.toLocaleString('en-IN');

        // Mark clicked button active
        event.target.classList.add('active');
        selectedAmountBtn = event.target;
    }
}

// Custom amount input handler
document.addEventListener('DOMContentLoaded', function() {
    const customInput = document.getElementById('customAmount');
    if (customInput) {
        customInput.addEventListener('input', function() {
            const val = parseInt(this.value) || 0;
            selectedAmount = val;
            document.getElementById('selectedAmount').textContent = 'Rs.' + val.toLocaleString('en-IN');
        });
    }
});

function validateDonationForm() {
    let valid = true;

    const name = document.getElementById('donorName');
    const email = document.getElementById('donorEmail');
    const phone = document.getElementById('donorPhone');

    // Reset errors
    document.querySelectorAll('[id$="Error"]').forEach(el => el.classList.add('hidden'));

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
        document.getElementById('nameError').classList.remove('hidden');
        valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        document.getElementById('emailError').classList.remove('hidden');
        valid = false;
    }

    // Validate phone
    const phoneRegex = /^[+]?[0-9\s-]{10,}$/;
    if (!phoneRegex.test(phone.value.trim())) {
        document.getElementById('phoneError').classList.remove('hidden');
        valid = false;
    }

    // Validate amount
    if (selectedAmount <= 0) {
        showToast('Error', 'Please select or enter a donation amount', 'error');
        valid = false;
    }

    return valid;
}

function payWithRazorpay() {
    if (!validateDonationForm()) return;

    const spinner = document.getElementById('razorpaySpinner');
    const icon = document.getElementById('razorpayIcon');

    spinner.classList.add('active');
    icon.classList.add('hidden');

    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    const phone = document.getElementById('donorPhone').value.trim();
    const message = document.getElementById('donorMessage').value.trim();

    // Store submission data before payment
    const submissionData = {
        name: name,
        email: email,
        phone: phone,
        amount: selectedAmount,
        message: message,
        status: 'pending'
    };

    // Razorpay Test Configuration
    const options = {
        key: 'rzp_test_1234567890abcdef', // Test key (demo)
        amount: selectedAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Gomantak Gausevak Mahasang',
        description: 'Donation for Cow Shelter',
        image: 'https://via.placeholder.com/64x64/16a34a/ffffff?text=GG',
        handler: function(response) {
            // Payment success handler
            submissionData.status = 'success';
            submissionData.paymentId = response.razorpay_payment_id;
            storeSubmission('donation', submissionData);

            spinner.classList.remove('active');
            icon.classList.remove('hidden');

            showToast('Payment Successful!', 'Thank you for your generous donation.');

            // Redirect to thank you page after short delay
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 1500);
        },
        prefill: {
            name: name,
            email: email,
            contact: phone
        },
        notes: {
            donation_type: 'cow_shelter',
            message: message
        },
        theme: {
            color: '#2d7a3e'
        },
        modal: {
            ondismiss: function() {
                spinner.classList.remove('active');
                icon.classList.remove('hidden');
                showToast('Payment Cancelled', 'You can try again anytime.', 'error');
            }
        }
    };

    try {
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (e) {
        // Fallback for demo without real Razorpay key
        spinner.classList.remove('active');
        icon.classList.remove('hidden');

        // Simulate successful payment for demo
        submissionData.status = 'success';
        submissionData.paymentId = 'pay_demo_' + Date.now();
        storeSubmission('donation', submissionData);

        showToast('Demo Payment Successful!', 'Thank you for your generous donation. (Demo Mode)');

        setTimeout(() => {
            window.location.href = 'thank-you.html';
        }, 1500);
    }
}
