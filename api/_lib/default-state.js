const DEFAULT_ORDERS_OPEN_TIME = "19:00";
const DEFAULT_ORDERS_CLOSE_TIME = "23:00";

const DEFAULT_MENU_CATEGORIES = [
  { id: "lanches", label: "Lanches", hidden: false },
  { id: "pratos", label: "Pratos", hidden: false },
  { id: "bebidas", label: "Bebidas", hidden: false },
  { id: "sobremesas", label: "Sobremesas", hidden: false }
];

const DEFAULT_MENU = [
  {
    id: "item-1",
    category: "lanches",
    title: "X-Burger Artesanal",
    ingredients: "Pao brioche, hamburguer bovino 160g, queijo cheddar, tomate e molho da casa.",
    unitPrice: 26.9,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-2",
    category: "lanches",
    title: "X-Bacon Supremo",
    ingredients: "Pao selado, hamburguer bovino 180g, queijo prato, bacon crocante, cebola caramelizada e molho especial.",
    unitPrice: 31.9,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-3",
    category: "pratos",
    title: "Parmegiana de Frango",
    ingredients: "File de frango empanado, molho de tomate artesanal, queijo gratinado, arroz branco e batata frita.",
    unitPrice: 42,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-4",
    category: "pratos",
    title: "Strogonoff de Carne",
    ingredients: "Tiras de carne, creme de leite, molho especial, arroz branco e batata palha.",
    unitPrice: 38.5,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-5",
    category: "bebidas",
    title: "Suco Natural 500ml",
    ingredients: "Fruta natural batida na hora e agua filtrada.",
    unitPrice: 11.9,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-6",
    category: "bebidas",
    title: "Refrigerante Lata",
    ingredients: "Bebida gaseificada em lata 350ml (Coca-Cola, Guarana, Sprite ou Fanta).",
    unitPrice: 6.5,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-7",
    category: "sobremesas",
    title: "Brownie com Sorvete",
    ingredients: "Brownie de chocolate, sorvete de creme e calda de chocolate.",
    unitPrice: 18.9,
    hidden: false,
    outOfStock: false
  },
  {
    id: "item-8",
    category: "sobremesas",
    title: "Pudim da Casa",
    ingredients: "Leite condensado, ovos, leite e calda de caramelo.",
    unitPrice: 12.9,
    hidden: false,
    outOfStock: false
  }
];

function buildDefaultCategories() {
  return DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
}

function buildDefaultMenu() {
  return DEFAULT_MENU.map((item) => ({ ...item }));
}

function buildDefaultState() {
  return {
    categories: buildDefaultCategories(),
    menu: buildDefaultMenu(),
    orders: [],
    ordersPaused: false,
    ordersOpenTime: DEFAULT_ORDERS_OPEN_TIME,
    ordersCloseTime: DEFAULT_ORDERS_CLOSE_TIME
  };
}

module.exports = {
  DEFAULT_ORDERS_OPEN_TIME,
  DEFAULT_ORDERS_CLOSE_TIME,
  DEFAULT_MENU_CATEGORIES,
  DEFAULT_MENU,
  buildDefaultCategories,
  buildDefaultMenu,
  buildDefaultState
};
