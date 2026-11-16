// Generated local image mapping. Do not edit by hand.
const PRODUCT_IMAGES = {
  "p21": "assets/img/products/flavor-hive-special.png",
  "p22": "assets/img/products/stuff-crust-pizza.jpg",
  "p23": "assets/img/products/crown-crust-pizza.webp",
  "p24": "assets/img/products/behari-kebab-pizza.png",
  "p25": "assets/img/products/malai-boti-pizza.png",
  "p26": "assets/img/products/chicken-tikka-pizza.jpg",
  "p27": "assets/img/products/chicken-fajita-pizza.avif",
  "p28": "assets/img/products/bonfire-pizza.png",
  "p29": "assets/img/products/vegetable-pizza.avif",
  "p30": "assets/img/products/cheese-lover-pizza.webp",
  "b32": "assets/img/products/chicken-burger.png",
  "b33": "assets/img/products/chicken-patty-burger.jpg",
  "b34": "assets/img/products/zinger-burger.png",
  "b35": "assets/img/products/chicken-grill-burger.jpg",
  "b36": "assets/img/products/chapli-kebab-burger.jpg",
  "b37": "assets/img/products/beef-burger.jpg",
  "b38": "assets/img/products/fish-burger.png",
  "b39": "assets/img/products/zinger-tower-burger.png",
  "k40": "assets/img/products/4-nuggets-fries-drink.png",
  "k41": "assets/img/products/3-chicken-strips-fries-drink.png",
  "k42": "assets/img/products/fish-and-chips.png",
  "s43": "assets/img/products/hot-shot-8-pcs.png",
  "s44": "assets/img/products/crispy-hot-wings-8-pcs.png",
  "s45": "assets/img/products/honey-glaze-wings-8-pcs.png",
  "f_reg": "assets/img/products/regular-fries.png",
  "f_mas": "assets/img/products/masala-fries.png",
  "f_gar": "assets/img/products/garlic-fries.png",
  "f_loa": "assets/img/products/loaded-fries.png",
  "f_che": "assets/img/products/cheese-fries.png",
  "f_piz": "assets/img/products/pizza-loaded-fries.png",
  "sw52": "assets/img/products/vegetable-grilled-sandwich.png",
  "sw53": "assets/img/products/fh-special-grilled-sandwich.jpg",
  "sw54": "assets/img/products/club-sandwich-fries.jpeg",
  "sw55": "assets/img/products/fh-special-oven-baked.jpg",
  "ps56": "assets/img/products/penne-pasta.png",
  "ps57": "assets/img/products/special-crunchy-pasta.png",
  "w58": "assets/img/products/chicken-shawarma.png",
  "w59": "assets/img/products/zinger-shawarma.png",
  "w60": "assets/img/products/paratha-roll.png",
  "w61": "assets/img/products/zinger-paratha-roll.png",
  "w62_wrap": "assets/img/products/tortilla-wrap.png",
  "w63_plat": "assets/img/products/chicken-platter.png",
  "br67": "assets/img/products/quarter-broast.jpg",
  "br68": "assets/img/products/half-broast.png",
  "br69": "assets/img/products/full-broast.png",
};

const DEAL_IMAGES = {
  "d01": "assets/img/deals/deal-01.jpg",
  "d02": "assets/img/deals/deal-02.jpg",
  "d03": "assets/img/deals/deal-03.jpg",
  "d04": "assets/img/deals/deal-04.jpg",
  "d05": "assets/img/deals/deal-05.jpg",
  "d06": "assets/img/deals/deal-06.jpg",
  "d07": "assets/img/deals/deal-07.jpg",
  "d08": "assets/img/deals/deal-08.jpg",
  "d09": "assets/img/deals/deal-09.jpg",
  "d10": "assets/img/deals/deal-10.jpg",
  "d11": "assets/img/deals/deal-11.jpg",
  "d12": "assets/img/deals/deal-12.jpg",
  "d13": "assets/img/deals/deal-13.jpg",
  "d14": "assets/img/deals/deal-14.jpg",
  "d15": "assets/img/deals/deal-15.jpg",
  "d16": "assets/img/deals/deal-16.jpg",
  "d17": "assets/img/deals/deal-17.jpg",
  "d18": "assets/img/deals/deal-18.jpg",
  "d19": "assets/img/deals/deal-19.jpg",
  "d20": "assets/img/deals/deal-20.jpg",
};

MENU.forEach((product) => {
  if (PRODUCT_IMAGES[product.id]) product.img = PRODUCT_IMAGES[product.id];
});

DEALS.forEach((deal) => {
  if (DEAL_IMAGES[deal.id]) deal.img = DEAL_IMAGES[deal.id];
});

if (HERO_SLIDES[0] && DEAL_IMAGES.d18) HERO_SLIDES[0].img = DEAL_IMAGES.d18;
if (HERO_SLIDES[1] && DEAL_IMAGES.d20) HERO_SLIDES[1].img = DEAL_IMAGES.d20;
if (HERO_SLIDES[2] && DEAL_IMAGES.d17) HERO_SLIDES[2].img = DEAL_IMAGES.d17;

if (GALLERY[0] && PRODUCT_IMAGES.p21) GALLERY[0].img = PRODUCT_IMAGES.p21;
if (GALLERY[1] && PRODUCT_IMAGES.b34) GALLERY[1].img = PRODUCT_IMAGES.b34;
if (GALLERY[2] && PRODUCT_IMAGES.s44) GALLERY[2].img = PRODUCT_IMAGES.s44;
if (GALLERY[3] && PRODUCT_IMAGES.f_loa) GALLERY[3].img = PRODUCT_IMAGES.f_loa;
if (GALLERY[4] && PRODUCT_IMAGES.w58) GALLERY[4].img = PRODUCT_IMAGES.w58;
if (GALLERY[5] && PRODUCT_IMAGES.ps56) GALLERY[5].img = PRODUCT_IMAGES.ps56;
