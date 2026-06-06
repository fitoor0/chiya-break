// 1. Initialize Connection via Netlify Integration credentials
// Paste your public credentials here from your Supabase dashboard API settings
const NETLIFY_DB_URL = "https://your-project-id.supabase.co"; 
const NETLIFY_DB_KEY = "your-actual-anon-public-key-here"; 

const _db = supabase.createClient(NETLIFY_DB_URL, NETLIFY_DB_KEY);

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

    // --- Database Insert: Orders Form ---
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('order-name').value;
        const phone = document.getElementById('order-phone').value;
        const item = orderItemSelect.value;
        const quantity = parseInt(orderQtyInput.value);

        // Submits directly to your linked database table
        const { error } = await _db
            .from('orders')
            .insert([{ customer_name: customerName, phone: phone, item: item, quantity: quantity }]);

        if (error) {
            alert("Database connection error. Try again.");
            console.error(error);
        } else {
            alert(`Order received, ${customerName}! Our crew is on it.`);
            orderForm.reset();
            totalAmountSpan.textContent = "Rs. 0";
        }
    });

    // --- Global Review System ---
    const stars = document.querySelectorAll('.star-rating .star');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    let chosenRating = 0;

    // Load global cloud reviews instantly on page mount
    loadGlobalDatabaseReviews();

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

    // --- Database Insert: Post Review ---
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameValue = document.getElementById('reviewer-name').value.trim();
        const textValue = document.getElementById('review-text').value.trim();

        if (chosenRating === 0) {
            alert("Please pick a star rating!");
            return;
        }

        const newReviewData = { name: nameValue, rating: chosenRating, text: textValue };

        // Post to global table
        const { error } = await _db.from('reviews').insert([newReviewData]);

        if (error) {
            alert("Submission error.");
        } else {
            // Render on screen immediately
            renderReviewCard(newReviewData, true);
            reviewForm.reset();
            chosenRating = 0;
            stars.forEach(s => s.classList.remove('selected'));
            reviewsList.scrollTop = 0;
        }
    });

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
            reviewsList.insertBefore(reviewCard, reviewsList.firstChild);
        } else {
            reviewsList.appendChild(reviewCard);
        }
    }

    // --- Database Fetch: Read global records ---
    async function loadGlobalDatabaseReviews() {
        const { data, error } = await _db
            .from('reviews')
            .select('*')
            .order('id', { ascending: false }); // pulls the newest items first

        if (error) {
            console.error("Database connection issue: ", error);
            return;
        }

        reviewsList.innerHTML = ''; // clear out fallback template values
        data.forEach(review => {
            renderReviewCard(review, false);
        });
    }
});