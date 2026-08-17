const container = document.querySelector(".products");

const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");

const loading = document.querySelector("#loading");

const productsCount = document.querySelector("#productsCount");

const cartBtn = document.querySelector("#cartBtn");
const cartModal = document.querySelector("#cartModal");
const closeCart = document.querySelector("#closeCart");

const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");

const checkout = document.querySelector("#checkout");


const API = "https://dummyjson.com/products";

let products = [];
let cart = [];


// ==========================
// GET PRODUCTS
// ==========================

async function getProducts() {

    try {

        loading.style.display = "block";

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Server bilan bog‘lanishda xatolik!");
        }

        const data = await response.json();

        products = data.products;

        loading.style.display = "none";

        renderProducts(products);

        createCategories();

    } catch (error) {

        loading.innerHTML = `
            <h2>❌ Xatolik</h2>
            <p>${error.message}</p>
        `;
    }
}


// ==========================
// RENDER PRODUCTS
// ==========================

function renderProducts(data) {

    container.innerHTML = "";

    productsCount.textContent = data.length;

    if (data.length === 0) {

        container.innerHTML = `
            <div>
                <h2>😔 Mahsulot topilmadi</h2>
            </div>
        `;

        return;
    }


    data.forEach(product => {

        const discount = Math.round(product.discountPercentage);

        container.innerHTML += `

            <div class="card">

                <div class="card-image">

                    ${
                        discount > 0
                        ?
                        `<span class="discount">
                            -${discount}%
                        </span>`
                        :
                        ""
                    }

                    <img
                        src="${product.thumbnail}"
                        alt="${product.title}"
                    >

                </div>


                <div class="card-body">

                    <span class="category">
                        ${product.category}
                    </span>

                    <h3>
                        ${product.title}
                    </h3>

                    <p class="description">
                        ${product.description}
                    </p>


                    <div class="card-info">

                        <span class="price">
                            $${product.price}
                        </span>

                        <span class="rating">
                            ⭐ ${product.rating}
                        </span>

                    </div>


                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================
// CATEGORIES
// ==========================

function createCategories() {

    const categories = [
        ...new Set(
            products.map(product => product.category)
        )
    ];


    categories.forEach(category => {

        categorySelect.innerHTML += `

            <option value="${category}">
                ${category}
            </option>

        `;

    });

}


// ==========================
// FILTER
// ==========================

function filterProducts() {

    const searchValue =
        searchInput.value.toLowerCase();

    const category =
        categorySelect.value;

    let result = products.filter(product => {

        const searchMatch =
            product.title
                .toLowerCase()
                .includes(searchValue);

        const categoryMatch =
            category === "all" ||
            product.category === category;

        return searchMatch && categoryMatch;

    });


    // SORT

    const sort = sortSelect.value;


    if (sort === "low") {

        result.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sort === "high") {

        result.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sort === "rating") {

        result.sort(
            (a, b) => b.rating - a.rating
        );

    }


    renderProducts(result);
}


// SEARCH

searchInput.addEventListener(
    "input",
    filterProducts
);


// CATEGORY

categorySelect.addEventListener(
    "change",
    filterProducts
);


// SORT

sortSelect.addEventListener(
    "change",
    filterProducts
);


// ==========================
// CART
// ==========================

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );


    cart.push(product);

    updateCart();

}


// UPDATE CART

function updateCart() {

    cartCount.textContent = cart.length;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Savatcha bo‘sh 🛒
            </p>
        `;

        cartTotal.textContent = "0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach((product, index) => {

        total += product.price;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                >

                <div class="cart-item-info">

                    <strong>
                        ${product.title}
                    </strong>

                    <p>
                        $${product.price}
                    </p>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    ✕
                </button>

            </div>

        `;

    });


    cartTotal.textContent =
        total.toFixed(2);

}


// REMOVE CART

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


// ==========================
// MODAL
// ==========================

cartBtn.addEventListener(
    "click",
    () => {

        cartModal.classList.add("active");

    }
);


closeCart.addEventListener(
    "click",
    () => {

        cartModal.classList.remove("active");

    }
);


cartModal.addEventListener(
    "click",
    (e) => {

        if (e.target === cartModal) {

            cartModal.classList.remove("active");

        }

    }
);


// ==========================
// CHECKOUT
// ==========================

checkout.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert("Savatcha bo‘sh!");

            return;
        }


        alert(
            "Buyurtmangiz qabul qilindi! 🎉"
        );

        cart = [];

        updateCart();

        cartModal.classList.remove(
            "active"
        );

    }
);


// ==========================
// START
// ==========================

getProducts();