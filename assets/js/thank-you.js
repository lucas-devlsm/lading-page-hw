document.addEventListener('DOMContentLoaded', function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Customer data
    const customerName = urlParams.get('name') || 'Valued Customer';
    const customerEmail = urlParams.get('email') || 'your email';
    
    // Product data
    const bottleQuantity = urlParams.get('quantity') || '0';
    const totalPrice = urlParams.get('price') || '$0.00';
    const productName = 'Natty Lean';
    
    // Set bonus content based on bottle quantity
    let bonusImage = '';
    let ebookName = '';
    
    switch (bottleQuantity) {
        case '6':
            bonusImage = 'assets/img/bonus/bonus1.webp';
            ebookName = 'Firm & Fit: Transform Your Body';
            break;
        case '3':
            bonusImage = 'assets/img/bonus/bonus2.webp';
            ebookName = 'Healthy Living Guide';
            break;
        case '2':
            bonusImage = 'assets/img/bonus/bonus3.webp';
            ebookName = 'Wellness Essentials';
            break;
        default:
            bonusImage = '';
            ebookName = '';
    }
    
    // Set product image based on quantity
    let productImage;
    switch (bottleQuantity) {
        case '6':
            productImage = 'assets/img/bottles/six-bottle.webp';
            break;
        case '3':
            productImage = 'assets/img/bottles/three-bottle.webp';
            break;
        case '2':
            productImage = 'assets/img/bottles/two-bottle.webp';
            break;
        default:
            productImage = 'assets/img/bottles/one-bottle.png';
    }
    
    // Update DOM elements
    document.getElementById('customerName').textContent = customerName;
    document.getElementById('customerEmail').textContent = customerEmail;
    document.getElementById('productName').textContent = productName;
    document.getElementById('totalPrice').textContent = totalPrice;
    document.getElementById('bottleQuantity').textContent = `${bottleQuantity} ${bottleQuantity === '1' ? 'Bottle' : 'Bottles'}`;
    document.getElementById('bonusBottles').textContent = bottleQuantity;
    
    // Set images
    const productImageEl = document.getElementById('productImage');
    if (productImageEl) {
        productImageEl.src = productImage;
        productImageEl.alt = `${bottleQuantity} Bottles of ${productName}`;
    }
    
    // Only show bonus section if there's a valid bonus
    const bonusSection = document.querySelector('.bonus-section');
    if (bonusImage && ebookName) {
        document.getElementById('ebookName').textContent = ebookName;
        const bonusImageEl = document.getElementById('bonusImage');
        if (bonusImageEl) {
            bonusImageEl.src = bonusImage;
            bonusImageEl.alt = ebookName;
        }
        bonusSection.style.display = 'block';
    } else {
        bonusSection.style.display = 'none';
    }
}); 