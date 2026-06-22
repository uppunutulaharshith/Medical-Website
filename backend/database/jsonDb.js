import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const INITIAL_PRODUCTS = [
  { id: 1, name: "Amoxicillin 500mg", category: "medicines", type: "Rx", price: 120.00, brand: "Cipla", desc: "Broad-spectrum antibiotic used to treat bacterial infections.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80" },
  { id: 2, name: "Metformin 500mg", category: "medicines", type: "Rx", price: 90.00, brand: "Abbott", desc: "Oral diabetes medicine that helps control blood sugar levels for Type 2 diabetes patients.", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80" },
  { id: 3, name: "Atorvastatin 10mg", category: "medicines", type: "Rx", price: 150.00, brand: "Pfizer", desc: "Statin medication used to prevent cardiovascular disease and lower lipid levels.", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80" },
  { id: 4, name: "Amlodipine 5mg", category: "medicines", type: "Rx", price: 80.00, brand: "Lupin", desc: "Calcium channel blocker used to treat high blood pressure and chest pain (angina).", image: "https://images.unsplash.com/photo-1628771065518-0d82f15e8e48?w=500&auto=format&fit=crop&q=80" },
  { id: 5, name: "Paracetamol 650mg", category: "medicines", type: "OTC", price: 30.00, brand: "Dolo", desc: "Analgesic and antipyretic drug for fast relief of fever, mild-to-moderate body pain, and headache.", image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80" },
  { id: 6, name: "Cetirizine 10mg", category: "medicines", type: "OTC", price: 45.00, brand: "Okacet", desc: "Second-generation antihistamine used for relief of allergic symptoms like runny nose, sneezing.", image: "https://images.unsplash.com/photo-1607619056574-7b8d304f3b24?w=500&auto=format&fit=crop&q=80" },
  { id: 7, name: "Ibuprofen 400mg", category: "medicines", type: "OTC", price: 50.00, brand: "Combiflam", desc: "Nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.", image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=500&auto=format&fit=crop&q=80" },
  { id: 8, name: "Cough Syrup (Herbal)", category: "medicines", type: "OTC", price: 110.00, brand: "Dabur Honitus", desc: "Fast-acting natural throat relief formula for wet and dry cough, enriched with Honey & Tulsi.", image: "https://images.unsplash.com/photo-1631549916768-4119b255f946?w=500&auto=format&fit=crop&q=80" },
  { id: 9, name: "Multivitamin Gold capsules", category: "wellness", type: "OTC", price: 350.00, brand: "Revital", desc: "Daily health supplement containing essential vitamins, minerals, and Ginseng extract.", image: "https://cdn01.pharmeasy.in/dam/products_otc/A47905/multivite-gold-essential-vitamins-minerals-tabgels-for-adults-15-nos-6.1-1777125603.jpg?dim=700x0&dpr=1&q=100" },
  { id: 10, name: "Calcium & Vitamin D3", category: "wellness", type: "OTC", price: 210.00, brand: "Shelcal", desc: "Support for strong bones, teeth, and muscle health. Highly absorbable formula.", image: "https://media.gettyimages.com/id/539670531/photo/studio-shot-of-various-pills-in-bottles.jpg?s=612x612&w=0&k=20&c=Dvr4FJXQT2W3-5_aGdqwmPCYanUpO6UddPzh0m83zBM=" },
  { id: 11, name: "Organic Whey Protein (500g)", category: "wellness", type: "OTC", price: 990.00, brand: "Optimum Nutrition", desc: "Premium quality grass-fed whey protein concentrate for muscle recovery and fitness support.", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=80" },
  { id: 12, name: "Aloe Vera Hydrating Gel", category: "personal-care", type: "OTC", price: 140.00, brand: "Patanjali", desc: "Pure soothing gel for skin hydration, sun protection, and calming minor skin irritations.", image: "https://images.unsplash.com/photo-1527813783279-51158be04a4c?w=500&auto=format&fit=crop&q=80" },
  { id: 13, name: "Gentle Facial Cleanser", category: "personal-care", type: "OTC", price: 280.00, brand: "Cetaphil", desc: "pH-balanced, soap-free formula suitable for all skin types, including sensitive skin.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80" },
  { id: 14, name: "Medicated Anti-Dandruff Shampoo", category: "personal-care", type: "OTC", price: 220.00, brand: "Selsun Blue", desc: "Contains Ketoconazole for long-lasting relief from dandruff, itching, and scaling.", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80" },
  { id: 15, name: "Hypoallergenic Baby Wipes", category: "baby-care", type: "OTC", price: 120.00, brand: "Himalaya", desc: "Fragrance-free, dermatologically tested wipes enriched with Aloe and Vitamin E.", image: "https://m.media-amazon.com/images/I/61La2wJE93L._AC_UF1000,1000_QL80_.jpg" },
  { id: 16, name: "Gentle Baby Moisturizing Lotion", category: "baby-care", type: "OTC", price: 195.00, brand: "Johnson's Baby", desc: "Nourishing formula designed to keep baby's delicate skin soft and moisturized for 24 hours.", image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQlooS51SS2zudUTxg377Cz9_yPhcvQyjrKl9hk8JUup3pOldKp9aFSlTUro7gJGuStKiK0z2rcAIoIXwq5vcLONdAm-5X_VxiL1s7BMZ7qP1tMoSJsL_vWCQ" },
  { id: 17, name: "Vitamin C 500mg", category: "wellness", type: "OTC", price: 75.00, brand: "Abbott", desc: "Vitamins and immunity booster", image: "https://www.shutterstock.com/shutterstock/photos/2763622271/display_1500/stock-photo-prosper-texas-usa-march-th-kirkland-signature-chewable-vitamin-c-mg-tangy-orange-2763622271.jpg" },
  { id: 18, name: "Pantoprazole 40mg", category: "medicines", type: "Rx", price: 110.00, brand: "Pan-D", desc: "Proton pump inhibitor that decreases the amount of acid produced in the stomach.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80" },
  { id: 19, name: "Azithromycin 500mg", category: "medicines", type: "Rx", price: 140.00, brand: "Azithral", desc: "Macrolide antibiotic used for treating various bacterial infections.", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80" },
  { id: 20, name: "Montelukast & Levocetirizine", category: "medicines", type: "Rx", price: 165.00, brand: "Monticope", desc: "Combination medicine used to prevent asthma symptoms and treat allergic rhinitis.", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80" },
  { id: 21, name: "Telmisartan 40mg", category: "medicines", type: "Rx", price: 95.00, brand: "Telma", desc: "Angiotensin II receptor antagonist used for the treatment of hypertension.", image: "https://images.unsplash.com/photo-1628771065518-0d82f15e8e48?w=500&auto=format&fit=crop&q=80" },
  { id: 22, name: "Loratadine 10mg", category: "medicines", type: "OTC", price: 55.00, brand: "Claritin", desc: "Non-drowsy 24-hour allergy relief tablets for sneezing, runny nose, and itchy eyes.", image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80" },
  { id: 23, name: "Ranitidine 150mg", category: "medicines", type: "OTC", price: 40.00, brand: "Zantac", desc: "H2 blocker that reduces stomach acid to treat and prevent heartburn and acid indigestion.", image: "https://images.unsplash.com/photo-1607619056574-7b8d304f3b24?w=500&auto=format&fit=crop&q=80" },
  { id: 24, name: "Diclofenac Gel 1%", category: "medicines", type: "OTC", price: 85.00, brand: "Volini", desc: "Topical pain relief gel for joint pain, backache, neck pain, and muscle sprains.", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbab9?w=500&auto=format&fit=crop&q=80" },
  { id: 25, name: "Antiseptic Liquid (500ml)", category: "medicines", type: "OTC", price: 220.00, brand: "Dettol", desc: "Trusted antiseptic liquid sanitizes wounds and disinfects household surfaces.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80" },
  { id: 26, name: "Ashwagandha Capsules", category: "wellness", type: "OTC", price: 180.00, brand: "Himalaya", desc: "Natural stress relief and energy booster supplement made from pure herb extract.", image: "https://cdn01.pharmeasy.in/dam/products_otc/A47905/multivite-gold-essential-vitamins-minerals-tabgels-for-adults-15-nos-6.1-1777125603.jpg?dim=700x0&dpr=1&q=100" },
  { id: 27, name: "Omega-3 Fish Oil 1000mg", category: "wellness", type: "OTC", price: 599.00, brand: "WOW Life Science", desc: "Rich source of EPA and DHA to support heart, joint, brain, and eye health.", image: "https://media.gettyimages.com/id/539670531/photo/studio-shot-of-various-pills-in-bottles.jpg?s=612x612&w=0&k=20&c=Dvr4FJXQT2W3-5_aGdqwmPCYanUpO6UddPzh0m83zBM=" },
  { id: 28, name: "Daily Probiotics 30 Billion", category: "wellness", type: "OTC", price: 480.00, brand: "HealthKart", desc: "Premium gut health supplement with multiple active probiotic strains.", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=80" },
  { id: 29, name: "Glucosamine Chondroitin Joint Support", category: "wellness", type: "OTC", price: 650.00, brand: "Carbamide Forte", desc: "Nutritional supplement supporting joint structure, mobility, and flexibility.", image: "https://images.unsplash.com/photo-1527813783279-51158be04a4c?w=500&auto=format&fit=crop&q=80" },
  { id: 30, name: "Herbal Green Tea (25 bags)", category: "wellness", type: "OTC", price: 160.00, brand: "Organic India", desc: "Antioxidant-rich organic green tea with Tulsi for metabolism and detox.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80" },
  { id: 31, name: "Eucalyptus Cough Drops (Menthol)", category: "wellness", type: "OTC", price: 45.00, brand: "Vicks", desc: "Fast-acting throat lozenges that soothe sore throats and clear nasal congestion.", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80" },
  { id: 32, name: "Coconut Hair Oil (300ml)", category: "personal-care", type: "OTC", price: 135.00, brand: "Parachute", desc: "100% pure coconut oil for deep hair nourishment and natural shine.", image: "https://m.media-amazon.com/images/I/61La2wJE93L._AC_UF1000,1000_QL80_.jpg" },
  { id: 33, name: "Moisturizing Cream (100g)", category: "personal-care", type: "OTC", price: 190.00, brand: "Nivea Soft", desc: "Lightweight, non-greasy moisturizing cream enriched with Jojoba oil & Vitamin E.", image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQlooS51SS2zudUTxg377Cz9_yPhcvQyjrKl9hk8JUup3pOldKp9aFSlTUro7gJGuStKiK0z2rcAIoIXwq5vcLONdAm-5X_VxiL1s7BMZ7qP1tMoSJsL_vWCQ" },
  { id: 34, name: "Sunscreen Lotion SPF 50", category: "personal-care", type: "OTC", price: 450.00, brand: "Neutrogena", desc: "Ultra-sheer dry-touch sunscreen providing broad-spectrum UVA/UVB protection.", image: "https://www.shutterstock.com/shutterstock/photos/2763622271/display_1500/stock-photo-prosper-texas-usa-march-th-kirkland-signature-chewable-vitamin-c-mg-tangy-orange-2763622271.jpg" },
  { id: 35, name: "Antiseptic Neem Face Wash", category: "personal-care", type: "OTC", price: 150.00, brand: "Himalaya Purifying", desc: "Soap-free herbal face wash that prevents pimples and purifies facial skin.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80" },
  { id: 36, name: "Medicated Toothpaste (Sensitive)", category: "personal-care", type: "OTC", price: 160.00, brand: "Sensodyne Rapid Relief", desc: "Toothpaste for fast relief and long-lasting protection from tooth sensitivity.", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80" },
  { id: 37, name: "Charcoal Peel-Off Mask (100g)", category: "personal-care", type: "OTC", price: 240.00, brand: "Bombay Shaving Co", desc: "Deep cleansing peel-off mask that removes blackheads, dirt, and excess oil.", image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80" },
  { id: 38, name: "Gentle Baby Shampoo (200ml)", category: "baby-care", type: "OTC", price: 175.00, brand: "Himalaya Baby", desc: "No-tears formula baby shampoo enriched with Hibiscus and Chickpea extracts.", image: "https://images.unsplash.com/photo-1628771065518-0d82f15e8e48?w=500&auto=format&fit=crop&q=80" },
  { id: 39, name: "Baby Diaper Rash Cream", category: "baby-care", type: "OTC", price: 320.00, brand: "Sebamed", desc: "Soothing rash cream with micronized titanium dioxide and pH 5.5 to protect delicate skin.", image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80" },
  { id: 40, name: "Talc-Free Baby Powder (200g)", category: "baby-care", type: "OTC", price: 180.00, brand: "Johnson's Blossoms", desc: "Cornstarch-based gentle baby powder that absorbs excess moisture and keeps skin fresh.", image: "https://images.unsplash.com/photo-1607619056574-7b8d304f3b24?w=500&auto=format&fit=crop&q=80" }
];

export const db = {
  async init() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Create empty collections or initialize them
      await this.ensureFile('products.json', INITIAL_PRODUCTS);
      await this.ensureFile('orders.json', []);
      await this.ensureFile('prescriptions.json', []);
      await this.ensureFile('contacts.json', []);

      // Create users and seed admin user
      const usersFile = path.join(DATA_DIR, 'users.json');
      try {
        await fs.access(usersFile);
      } catch {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const initialUsers = [
          {
            id: 1,
            name: "Laxmi Narsimha Admin",
            email: "admin@laxmi.com",
            password: hashedPassword,
            role: "admin",
            createdAt: new Date().toISOString()
          }
        ];
        await fs.writeFile(usersFile, JSON.stringify(initialUsers, null, 2), 'utf-8');
        console.log("Database initialized: Admin user seeded successfully.");
      }

      console.log("JSON Database initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  },

  async ensureFile(fileName, defaultContent) {
    const filePath = path.join(DATA_DIR, fileName);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
      console.log(`Created database file: ${fileName}`);
    }
  },

  async getCollection(collectionName) {
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading collection ${collectionName}:`, error);
      return [];
    }
  },

  async saveCollection(collectionName, data) {
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`Error writing collection ${collectionName}:`, error);
      return false;
    }
  },

  // CRUD Helper: Find
  async find(collectionName, query = {}) {
    const collection = await this.getCollection(collectionName);
    return collection.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  // CRUD Helper: FindOne
  async findOne(collectionName, query = {}) {
    const collection = await this.getCollection(collectionName);
    return collection.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  },

  // CRUD Helper: InsertOne
  async insertOne(collectionName, document) {
    const collection = await this.getCollection(collectionName);
    const newDoc = {
      id: collection.length > 0 ? Math.max(...collection.map(d => d.id)) + 1 : 1,
      ...document,
      createdAt: new Date().toISOString()
    };
    collection.push(newDoc);
    await this.saveCollection(collectionName, collection);
    return newDoc;
  },

  // CRUD Helper: UpdateOne
  async updateOne(collectionName, query, updateFields) {
    const collection = await this.getCollection(collectionName);
    let updated = null;
    const updatedCollection = collection.map(item => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        updated = { ...item, ...updateFields, updatedAt: new Date().toISOString() };
        return updated;
      }
      return item;
    });

    if (updated) {
      await this.saveCollection(collectionName, updatedCollection);
    }
    return updated;
  },

  // CRUD Helper: DeleteOne
  async deleteOne(collectionName, query) {
    const collection = await this.getCollection(collectionName);
    let deleted = false;
    const filteredCollection = collection.filter(item => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        deleted = true;
        return false;
      }
      return true;
    });

    if (deleted) {
      await this.saveCollection(collectionName, filteredCollection);
    }
    return deleted;
  }
};
