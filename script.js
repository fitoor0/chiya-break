document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark / Light Mode Feature ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });

    // --- Interactive Menu Filtering Feature ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Real-Time Live Order Estimation ---
    const orderItemSelect = document.getElementById('order-item');
    const orderQtyInput = document.getElementById('order-qty');
    const totalAmountSpan = document.getElementById('total-amount');
    const orderForm = document.getElementById('order-form');

    function calculateTotal() {
        const selectedOption = orderItemSelect.options[orderItemSelect.selectedIndex];
        const price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        const qty = parseInt(orderQtyInput.value) || 1;
        totalAmountSpan.textContent = `Rs. ${price * qty}`;
    }

    orderItemSelect.addEventListener('change', calculateTotal);
    orderQtyInput.addEventListener('input', calculateTotal);

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Thank you for your order, ${document.getElementById('order-name').value}! Our crew will contact you shortly to confirm your table/delivery confirmation details.`);
        orderForm.reset();
        totalAmountSpan.textContent = "Rs. 0";
    });

    // --- Live Google Play Style Review System ---
    const stars = document.querySelectorAll('.star-rating .star');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    let chosenRating = 0;

    // Star Selection Interaction
    stars.forEach(star => {
        star.addEventListener('click', () => {
            chosenRating = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                if(parseInt(s.getAttribute('data-value')) <= chosenRating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });

    // Review Submission and Instant DOM Injection
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameValue = document.getElementById('reviewer-name').value.trim();
        const textValue = document.getElementById('review-text').value.trim();

        if (chosenRating === 0) {
            alert("Please provide a star rating for your break session!");
            return;
        }

        // Generate stars string
        const starString = "★".repeat(chosenRating) + "☆".repeat(5 - chosenRating);
        const firstLetter = nameValue.charAt(0).toUpperCase();

        // Create elements immediately matching layout rules
        const newReviewCard = document.createElement('div');
        newReviewCard.classList.add('review-card');
        
        newReviewCard.innerHTML = `
            <div class="review-card-header">
                <span class="user-avatar">${firstLetter}</span>
                <div>
                    <h4 class="user-name">${nameValue}</h4>
                    <div class="review-stars">${starString}</div>
                </div>
            </div>
            <p class="review-content">${textValue}</p>
        `;

        // Prepend to top of the review column
        reviewsList.insertBefore(newReviewCard, reviewsList.firstChild);

        // Reset elements securely
        reviewForm.reset();
        chosenRating = 0;
        stars.forEach(s => s.classList.remove('selected'));
        
        // Scroll list naturally to check fresh entry details
        reviewsList.scrollTop = 0;
    });
});