document.addEventListener('DOMContentLoaded', function () {
    const modal = document.querySelector('.purchase-modal');
    const buyButtons = document.querySelectorAll('.buy-button');
    const closeButton = modal.querySelector('.close-modal');
    const modalForm = modal.querySelector('.modal-form');
    let selectedPackage = '';

    // Set form field attributes
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    // Add autocomplete attributes
    if (fullNameInput) {
        fullNameInput.setAttribute('autocomplete', 'name');
    }
    if (emailInput) {
        emailInput.setAttribute('autocomplete', 'email');
    }
    if (phoneInput) {
        phoneInput.setAttribute('autocomplete', 'tel');
        
        // Add input validation for phone
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Remove any character that isn't a number, +, -, (, ), or space
            value = value.replace(/[^\d+\-() ]/g, '');
            
            // Limit consecutive special characters
            value = value.replace(/[\+\-() ]{2,}/g, match => match[0]);
            
            // Update input value
            e.target.value = value;
            
            // Validate length
            if (value.replace(/[\+\-() ]/g, '').length < 10) {
                phoneInput.setCustomValidity('Phone number must have at least 10 digits');
            } else {
                phoneInput.setCustomValidity('');
            }
        });

        // Add blur event to format phone number
        phoneInput.addEventListener('blur', function(e) {
            let value = e.target.value;
            // Remove all non-digits
            const digits = value.replace(/\D/g, '');
            
            // Format the number based on length
            if (digits.length === 11) { // Format for 11 digits
                value = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
            } else if (digits.length === 10) { // Format for 10 digits
                value = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
            }
            
            e.target.value = value;
        });
    }

    // Open modal and set product details
    function openModal(e) {
        e.preventDefault();
        const offerCard = e.target.closest('.offer-card');
        
        // Get product details
        const packageName = offerCard.querySelector('h4').textContent;
        const productImage = offerCard.querySelector('.product-image img').src;
        const price = offerCard.querySelector('.price .amount').textContent;
        const supply = offerCard.querySelector('.supply').textContent;
        const newPrice = offerCard.querySelector('.payment-info .new-price').textContent;
        
        // Get bottle quantity from package name (e.g., "6 BOTTLES" -> "6")
        const bottleQuantity = packageName.split(' ')[0];
        
        // Set modal product details
        modal.querySelector('.selected-product .product-image img').src = productImage;
        modal.querySelector('.selected-product .product-image img').alt = packageName;
        modal.querySelector('.selected-product h3').textContent = packageName;
        modal.querySelector('.selected-product .price').textContent = newPrice;
        modal.querySelector('.selected-product .supply').textContent = supply;
        
        // Store selected package info
        selectedPackage = {
            name: packageName,
            price: newPrice,
            supply: supply,
            quantity: bottleQuantity
        };

        // Show modal with animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close modal with animation
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close modal when clicking outside
    function clickOutside(e) {
        if (e.target === modal) {
            closeModal();
        }
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            package: selectedPackage
        };
        
        // Clear form
        modalForm.reset();
        
        // Close modal
        closeModal();
        
        // Redirect to thank you page with parameters
        const params = new URLSearchParams({
            name: formData.name,
            email: formData.email,
            quantity: selectedPackage.quantity,
            price: selectedPackage.price
        });
        
        window.location.href = `congratulations.html?${params.toString()}`;
    }

    // Add event listeners
    buyButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
    
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', clickOutside);
    modalForm.addEventListener('submit', handleSubmit);

    // Handle escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});