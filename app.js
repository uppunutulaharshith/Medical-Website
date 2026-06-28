// --- MOCK DATABASE ---
const PRODUCTS = [
    { id: 1, name: "Amoxicillin 500mg", category: "medicines", type: "Rx", price: 120, desc: "Broad-spectrum antibiotic for bacterial infections." },
    { id: 2, name: "Metformin 500mg", category: "medicines", type: "Rx", price: 90, desc: "Oral diabetes medicine for Type 2 diabetes." },
    { id: 3, name: "Atorvastatin 10mg", category: "medicines", type: "Rx", price: 150, desc: "Statin to prevent cardiovascular disease." },
    { id: 4, name: "Amlodipine 5mg", category: "medicines", type: "Rx", price: 80, desc: "Calcium channel blocker for high blood pressure." },
    { id: 5, name: "Paracetamol 650mg", category: "medicines", type: "OTC", price: 30, desc: "Fever and mild-to-moderate pain relief." },
    { id: 6, name: "Cetirizine 10mg", category: "medicines", type: "OTC", price: 45, desc: "Antihistamine for allergy symptoms." },
    { id: 7, name: "Ibuprofen 400mg", category: "medicines", type: "OTC", price: 50, desc: "NSAID for pain, fever, and inflammation." },
    { id: 8, name: "Cough Syrup (Herbal)", category: "medicines", type: "OTC", price: 110, desc: "Fast-acting herbal throat relief formula." },
    { id: 9, name: "Multivitamin Gold capsules", category: "wellness", type: "OTC", price: 350, desc: "Daily health supplement containing essential vitamins." },
    { id: 10, name: "Calcium & Vitamin D3", category: "wellness", type: "OTC", price: 210, desc: "Bones, teeth, and muscle health support." },
    { id: 11, name: "Organic Whey Protein (500g)", category: "wellness", type: "OTC", price: 990, desc: "Grass-fed whey protein for muscle recovery." },
    { id: 12, name: "Aloe Vera Hydrating Gel", category: "personal-care", type: "OTC", price: 140, desc: "Pure soothing gel for skin hydration." },
    { id: 13, name: "Gentle Facial Cleanser", category: "personal-care", type: "OTC", price: 280, desc: "pH-balanced, soap-free cleanser." },
    { id: 14, name: "Medicated Anti-Dandruff Shampoo", category: "personal-care", type: "OTC", price: 220, desc: "Relief from dandruff and itching." },
    { id: 15, name: "Hypoallergenic Baby Wipes", category: "baby-care", type: "OTC", price: 120, desc: "Fragrance-free wipes with Aloe & Vitamin E." },
    { id: 16, name: "Gentle Baby Moisturizing Lotion", category: "baby-care", type: "OTC", price: 195, desc: "Nourishing formula for baby's skin." },
    { id: 17, name: "Vitamin C 500mg", category: "wellness", type: "OTC", price: 75, desc: "Vitamins and immunity booster." },
    { id: 18, name: "Pantoprazole 40mg", category: "medicines", type: "Rx", price: 110, desc: "Proton pump inhibitor that decreases the amount of acid produced in the stomach." },
    { id: 19, name: "Azithromycin 500mg", category: "medicines", type: "Rx", price: 140, desc: "Macrolide antibiotic used for treating various bacterial infections." },
    { id: 20, name: "Montelukast & Levocetirizine", category: "medicines", type: "Rx", price: 165, desc: "Combination medicine used to prevent asthma symptoms and treat allergic rhinitis." },
    { id: 21, name: "Telmisartan 40mg", category: "medicines", type: "Rx", price: 95, desc: "Angiotensin II receptor antagonist used for the treatment of hypertension." },
    { id: 22, name: "Loratadine 10mg", category: "medicines", type: "OTC", price: 55, desc: "Non-drowsy 24-hour allergy relief tablets for sneezing, runny nose, and itchy eyes." },
    { id: 23, name: "Ranitidine 150mg", category: "medicines", type: "OTC", price: 40, desc: "H2 blocker that reduces stomach acid to treat and prevent heartburn and acid indigestion." },
    { id: 24, name: "Diclofenac Gel 1%", category: "medicines", type: "OTC", price: 85, desc: "Topical pain relief gel for joint pain, backache, neck pain, and muscle sprains." },
    { id: 25, name: "Antiseptic Liquid (500ml)", category: "medicines", type: "OTC", price: 220, desc: "Trusted antiseptic liquid sanitizes wounds and disinfects household surfaces." },
    { id: 26, name: "Ashwagandha Capsules", category: "wellness", type: "OTC", price: 180, desc: "Natural stress relief and energy booster supplement made from pure herb extract." },
    { id: 27, name: "Omega-3 Fish Oil 1000mg", category: "wellness", type: "OTC", price: 599, desc: "Rich source of EPA and DHA to support heart, joint, brain, and eye health." },
    { id: 28, name: "Daily Probiotics 30 Billion", category: "wellness", type: "OTC", price: 480, desc: "Premium gut health supplement with multiple active probiotic strains." },
    { id: 29, name: "Glucosamine Chondroitin Joint Support", category: "wellness", type: "OTC", price: 650, desc: "Nutritional supplement supporting joint structure, mobility, and flexibility." },
    { id: 30, name: "Herbal Green Tea (25 bags)", category: "wellness", type: "OTC", price: 160, desc: "Antioxidant-rich organic green tea with Tulsi for metabolism and detox." },
    { id: 31, name: "Eucalyptus Cough Drops (Menthol)", category: "wellness", type: "OTC", price: 45, desc: "Fast-acting throat lozenges that soothe sore throats and clear nasal congestion." },
    { id: 32, name: "Coconut Hair Oil (300ml)", category: "personal-care", type: "OTC", price: 135, desc: "100% pure coconut oil for deep hair nourishment and natural shine." },
    { id: 33, name: "Moisturizing Cream (100g)", category: "personal-care", type: "OTC", price: 190, desc: "Lightweight, non-greasy moisturizing cream enriched with Jojoba oil & Vitamin E." },
    { id: 34, name: "Sunscreen Lotion SPF 50", category: "personal-care", type: "OTC", price: 450, desc: "Ultra-sheer dry-touch sunscreen providing broad-spectrum UVA/UVB protection." },
    { id: 35, name: "Antiseptic Neem Face Wash", category: "personal-care", type: "OTC", price: 150, desc: "Soap-free herbal face wash that prevents pimples and purifies facial skin." },
    { id: 36, name: "Medicated Toothpaste (Sensitive)", category: "personal-care", type: "OTC", price: 160, desc: "Toothpaste for fast relief and long-lasting protection from tooth sensitivity." },
    { id: 37, name: "Charcoal Peel-Off Mask (100g)", category: "personal-care", type: "OTC", price: 240, desc: "Deep cleansing peel-off mask that removes blackheads, dirt, and excess oil." },
    { id: 38, name: "Gentle Baby Shampoo (200ml)", category: "baby-care", type: "OTC", price: 175, desc: "No-tears formula baby shampoo enriched with Hibiscus and Chickpea extracts." },
    { id: 39, name: "Baby Diaper Rash Cream", category: "baby-care", type: "OTC", price: 320, desc: "Soothing rash cream with micronized titanium dioxide and pH 5.5 to protect delicate skin." },
    { id: 40, name: "Talc-Free Baby Powder (200g)", category: "baby-care", type: "OTC", price: 180, desc: "Cornstarch-based gentle baby powder that absorbs excess moisture and keeps skin fresh." }
];

// --- CONFIGURATION ---
// Set this to your deployed backend API URL (e.g., 'https://medical-website-backend.onrender.com/api') in production
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5003/api'
    : 'https://medical-website-fefj.onrender.com/api'; // Replace with your production API URL

// --- APP STATE ---
let cart = [];
let selectedCategory = "all";
let searchFilter = "";
let uploadedFile = null;

// --- DOM ELEMENTS ---
document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    
    // Theme Switcher
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    $("theme-toggle")?.addEventListener("click", () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // Mobile Menu Control
    const mobBtn = $("mobile-menu-btn"), nav = $("nav-links");
    mobBtn?.addEventListener("click", () => {
        mobBtn.classList.toggle("open");
        nav?.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach(link => 
        link.addEventListener("click", () => {
            mobBtn?.classList.remove("open");
            nav?.classList.remove("open");
        })
    );

    // Initializations
    fetchProducts();
    setupFilters();
    setupCart();
    setupPrescriptionForm();
    setupCalculators();
    setupContactForm();
});

// --- DYNAMIC PRODUCTS FETCH ---
let productsList = [];

async function fetchProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success && data.products) {
            productsList = data.products;
        } else {
            productsList = PRODUCTS;
        }
    } catch (err) {
        console.error("Failed to fetch products from API, falling back to static database:", err);
        productsList = PRODUCTS;
    }
    renderProducts();
}

// --- RENDER PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const listToFilter = productsList.length > 0 ? productsList : PRODUCTS;
    const filtered = listToFilter.filter(p => 
        (selectedCategory === "all" || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.desc.toLowerCase().includes(searchFilter.toLowerCase()))
    );

    if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);"><p>No products found matching your criteria.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const cls = p.type === "Rx" ? "badge-rx" : (p.category === "wellness" ? "badge-wellness" : "badge-otc");
        return `
            <div class="glass-card product-card" data-id="${p.id}">
                <div class="product-badge ${cls}">${p.type} / ${p.category.replace('-', ' ')}</div>
                <h3>${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-meta">
                    <span class="product-price">₹${p.price.toFixed(2)}</span>
                    <button class="btn-icon add-to-cart-btn" aria-label="Add to cart" data-id="${p.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            addToCart(parseInt(btn.getAttribute("data-id")));
            btn.style.transform = "scale(0.8)";
            setTimeout(() => btn.style.transform = "scale(1)", 150);
        });
    });
}

// --- FILTER & SEARCH SYSTEM ---
function setupFilters() {
    document.getElementById("catalog-search")?.addEventListener("input", (e) => {
        searchFilter = e.target.value;
        renderProducts();
    });

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            selectedCategory = btn.getAttribute("data-category");
            renderProducts();
        });
    });
}

// --- CART LOGIC ---
function setupCart() {
    const $ = id => document.getElementById(id);
    const panel = $("cart-panel"), overlay = $("cart-overlay"), openBtn = $("cart-open-btn");
    const toggle = (show) => {
        panel?.classList.toggle("open", show);
        overlay?.classList.toggle("open", show);
    };

    openBtn?.addEventListener("click", () => toggle(true));
    [$("close-cart"), overlay].forEach(el => el?.addEventListener("click", () => toggle(false)));

    const stored = localStorage.getItem("medical_cart");
    if (stored) {
        cart = JSON.parse(stored);
        updateCartBadge();
        renderCartItems();
    }

    $("checkout-btn")?.addEventListener("click", () => {
        if (!cart.length) return;

        // Save order details to the backend database
        const orderBody = {
            items: cart.map(it => {
                const prod = PRODUCTS.find(p => p.id === it.id);
                return {
                    productId: it.id,
                    name: it.name,
                    brand: prod ? prod.brand || 'Generic' : 'Generic',
                    type: prod ? prod.type || 'OTC' : 'OTC',
                    qty: it.qty,
                    price: it.price
                };
            }),
            total: cart.reduce((s, c) => s + c.price * c.qty, 0),
            addressDetails: {
                name: "WhatsApp Guest Customer",
                phone: "917569796263",
                address: "Ordered via Static Website",
                city: "Hyderabad",
                zip: "500001"
            },
            paymentDetails: {
                method: "COD",
                status: "Pending",
                transactionId: ""
            }
        };

        fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderBody)
        }).then(res => res.json())
        .then(data => {
            console.log("Order saved to backend database:", data);
        }).catch(err => {
            console.error("Failed to save order to backend database:", err);
        });

        let msg = "*Laxmi Narsima Medical & General Store*\n*New Order Inquiry:*\n\n" +
            cart.map((it, idx) => {
                const prod = productsList.find(p => p.id === it.id) || PRODUCTS.find(p => p.id === it.id);
                return `${idx + 1}. ${it.name} x ${it.qty} - ₹${(it.price * it.qty).toFixed(2)}${prod?.type === "Rx" ? " (Requires Rx)" : ""}`;
            }).join('\n') +
            `\n\n*Total Estimate: ₹${cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}*\n*Store UPI ID for Payment:* 7569796263-k352@axl\n\n_Note: Please upload any required prescriptions if you have Rx items in your list._`;

        window.open(`https://wa.me/917569796263?text=${encodeURIComponent(msg)}`, '_blank');
        cart = [];
        saveCart();
        updateCartBadge();
        renderCartItems();
        toggle(false);
        alert("Order draft generated! You are being redirected to WhatsApp to send your list to Laxmi Narsima Store.");
    });
}

function addToCart(id) {
    const prod = productsList.find(p => p.id === id) || PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    const existing = cart.find(it => it.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
    saveCart();
    updateCartBadge();
    renderCartItems();
    document.getElementById("cart-panel")?.classList.contains("open") || document.getElementById("cart-open-btn")?.click();
}

function updateQty(id, delta) {
    const item = cart.find(it => it.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(it => it.id !== id);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

const saveCart = () => localStorage.setItem("medical_cart", JSON.stringify(cart));

function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const count = cart.reduce((acc, curr) => acc + curr.qty, 0);
    badge.innerText = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartItems() {
    const container = document.getElementById("cart-items-container"), totalEl = document.getElementById("cart-total-price"), checkoutBtn = document.getElementById("checkout-btn");
    if (!container || !totalEl || !checkoutBtn) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><p>Your medicine cart is empty.</p></div>`;
        totalEl.innerText = "₹0.00";
        Object.assign(checkoutBtn.style, { opacity: "0.5", pointerEvents: "none" });
        checkoutBtn.setAttribute("disabled", "true");
        return;
    }

    Object.assign(checkoutBtn.style, { opacity: "1", pointerEvents: "auto" });
    checkoutBtn.removeAttribute("disabled");
    container.innerHTML = cart.map(it => `
        <div class="cart-item">
            <div class="cart-item-info"><h4>${it.name}</h4><div class="cart-item-price">₹${(it.price * it.qty).toFixed(2)}</div></div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQty(${it.id}, -1)">-</button>
                <span>${it.qty}</span>
                <button class="qty-btn" onclick="updateQty(${it.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    totalEl.innerText = `₹${cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}`;
}

// --- PRESCRIPTION FORM ---
function setupPrescriptionForm() {
    const dropzone = document.getElementById("dropzone"), input = document.getElementById("file-input"), preview = document.getElementById("file-preview");
    if (!dropzone || !input) return;

    dropzone.addEventListener("click", () => input.click());
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener("change", (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    document.getElementById("remove-file")?.addEventListener("click", (e) => {
        e.stopPropagation();
        uploadedFile = null;
        input.value = "";
        preview.style.display = "none";
        dropzone.style.display = "flex";
    });

    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) return alert("File size exceeds 5MB.");
        if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) return alert("Invalid file format.");
        uploadedFile = file;
        document.getElementById("file-name").innerText = file.name;
        dropzone.style.display = "none";
        preview.style.display = "flex";
    }

    const opts = document.querySelectorAll(".delivery-option");
    opts.forEach(opt => {
        opt.addEventListener("click", () => {
            opts.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            const radio = opt.querySelector("input[type='radio']");
            if (radio) radio.checked = true;
        });
    });

    document.getElementById("prescription-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!uploadedFile) return alert("Please upload an image or PDF copy of your prescription first.");
        const val = id => document.getElementById(id).value;
        const delType = document.querySelector("input[name='delivery-type']:checked").value;

        // Save prescription details and file to the backend database
        const formData = new FormData();
        formData.append('name', val("rx-name"));
        formData.append('phone', val("rx-phone"));
        formData.append('deliveryOption', delType);
        formData.append('address', delType === "home" ? val("rx-address") : "");
        formData.append('notes', val("rx-notes") || "");
        formData.append('prescriptionCopy', uploadedFile);

        fetch(`${API_URL}/prescriptions`, {
            method: 'POST',
            body: formData
        }).then(res => res.json())
        .then(data => {
            console.log("Prescription saved to backend:", data);
        }).catch(err => {
            console.error("Failed to save prescription to backend:", err);
        });
        
        let msg = `*Laxmi Narsima Medical & General Store*\n*Prescription Upload Request:*\n\n` +
            `*Customer:* ${val("rx-name")}\n*Contact Phone:* ${val("rx-phone")}\n*Service Option:* ${delType === "home" ? "Home Delivery" : "Store Pickup"}\n`;
        if (delType === "home") msg += `*Delivery Address:* ${val("rx-address")}\n`;
        if (val("rx-notes")) msg += `*Notes:* ${val("rx-notes")}\n`;
        msg += `\n*Prescription attached:* [Ref: ${uploadedFile.name}]\n_Note: Please attach your prescription image in the WhatsApp chat immediately after opening._`;

        window.open(`https://wa.me/917569796263?text=${encodeURIComponent(msg)}`, '_blank');
        e.target.reset();
        uploadedFile = null;
        preview.style.display = "none";
        dropzone.style.display = "flex";
        alert("Prescription order generated! You are being redirected to WhatsApp. Please attach your prescription file.");
    });
}

// --- HEALTH CALCULATORS ---
function setupCalculators() {
    // BMI
    document.getElementById("calculate-bmi-btn")?.addEventListener("click", () => {
        const w = parseFloat(document.getElementById("bmi-weight").value);
        const h = parseFloat(document.getElementById("bmi-height").value);
        if (!w || !h || w <= 0 || h <= 0) return alert("Please enter valid positive numbers.");
        const bmi = w / ((h / 100) ** 2);
        const bmiVal = document.getElementById("bmi-val");
        bmiVal.innerText = bmi.toFixed(1);
        
        let desc = "Normal: Congratulations on maintaining a healthy weight!", color = "var(--success)";
        if (bmi < 18.5) { desc = "Underweight: We suggest consultation and protein-rich wellness diets."; color = "var(--warning)"; }
        else if (bmi >= 25 && bmi < 29.9) { desc = "Overweight: Moderate calorie diets and physical exercises recommended."; color = "var(--warning)"; }
        else if (bmi >= 30) { desc = "Obese: Consult doctors regarding obesity risks and cardiovascular wellness."; color = "var(--accent)"; }
        
        bmiVal.style.color = color;
        document.getElementById("bmi-desc").innerText = desc;
    });

    // Water Tracker
    const wtIn = document.getElementById("water-weight"), actSel = document.getElementById("water-activity");
    const goalVal = document.getElementById("water-goal-val"), progVal = document.getElementById("water-progress-val"), wave = document.getElementById("water-wave");
    let currentWater = 0, waterGoal = 2500;

    const update = () => {
        const wt = parseFloat(wtIn.value);
        if (wt > 0) {
            waterGoal = Math.round(wt * 35 + (actSel.value === "medium" ? 500 : actSel.value === "high" ? 1000 : 0));
            goalVal.innerText = `${waterGoal} ml`;
        }
        progVal.innerText = currentWater;
        const pct = Math.min((currentWater / waterGoal) * 100, 100);
        wave.style.height = `${pct}%`;
        document.getElementById("water-text-indicator").style.color = pct > 50 ? "#fff" : "var(--text-main)";
    };

    [wtIn, actSel].forEach(el => el?.addEventListener("input", update));
    document.getElementById("add-glass-btn")?.addEventListener("click", () => { currentWater += 250; update(); });
    document.getElementById("reset-water-btn")?.addEventListener("click", () => { currentWater = 0; update(); });
    update();
}

// --- CONTACT FORM ---
function setupContactForm() {
    document.getElementById("store-contact-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const phone = document.getElementById("contact-phone")?.value || "";
        const subject = document.getElementById("contact-subject")?.value || "General Query";
        const message = document.getElementById("contact-message")?.value || "";

        // Save contact request to backend database
        const contactBody = { name, email, phone, subject, message };

        fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactBody)
        }).then(res => res.json())
        .then(data => {
            console.log("Contact query saved to backend:", data);
        }).catch(err => {
            console.error("Failed to save contact query to backend:", err);
        });

        // Construct email body and redirect via mailto
        const emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`;
        window.location.href = `mailto:harshithuppunutula@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        alert(`Thank you, ${name}! Preparing email to send to harshithuppunutula@gmail.com...`);
        e.target.reset();
    });
}
