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
        alert(`Thank you for your order, ${document.getElementById('order-name').value}! Our crew will contact you shortly to confirm your details.`);
        orderForm.reset();
        totalAmountSpan.textContent = "Rs. 0";
    });

    // --- Persistent Google Play Style Review System ---
    const stars = document.querySelectorAll('.star-rating .star');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    let chosenRating = 0;

    // Load saved reviews from localStorage as soon as the page loads
    loadSavedReviews();

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

    // Review Submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameValue = document.getElementById('reviewer-name').value.trim();
        const textValue = document.getElementById('review-text').value.trim();

        if (chosenRating === 0) {
            alert("Please provide a star rating for your break session!");
            return;
        }

        // Create a review object
        const newReview = {
            name: nameValue,
            rating: chosenRating,
            text: textValue,
            timestamp: new Date().getTime() // used to keep track of order
        };

        // Save review to localStorage database array
        saveReviewToStorage(newReview);

        // Display the review instantly on screen
        renderReviewCard(newReview, true);

        // Reset elements securely
        reviewForm.reset();
        chosenRating = 0;
        stars.forEach(s => s.classList.remove('selected'));
        reviewsList.scrollTop = 0;
    });

    // Function to render a single review item card inside the HTML layout
    function renderReviewCard(review, isNewItem = false) {
        const starString = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        const firstLetter = review.name.charAt(0).toUpperCase();

        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
        
        reviewCard.innerHTML = `
            <div class="review-card-header">
                <span class="user-avatar">${firstLetter}</span>
                <div>
                    <h4 class="user-name">${review.name}</h4>
                    <div class="review-stars">${starString}</div>
                </div>
            </div>
            <p class="review-content">${review.text}</p>
        `;

        if (isNewItem) {
            // Put brand new custom reviews at the absolute top of the list
            reviewsList.insertBefore(reviewCard, reviewsList.firstChild);
        } else {
            // Append old stored reviews to the container naturally
            reviewsList.appendChild(reviewCard);
        }
    }

    // Function to save review into localStorage
    function saveReviewToStorage(review) {
        let reviews = JSON.parse(localStorage.getItem('cafeReviews')) || [];
        reviews.unshift(review); // Add new review to the beginning of the saved array
        localStorage.setItem('cafeReviews', JSON.stringify(reviews));
    }

    // Function to fetch and build elements from storage array
    function loadSavedReviews() {
        let reviews = JSON.parse(localStorage.getItem('cafeReviews')) || [];
        reviews.forEach(review => {
            renderReviewCard(review, false);
        });
    }
});