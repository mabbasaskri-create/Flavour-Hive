// Generated local image mapping. Do not edit by hand.
const PRODUCT_IMAGES = {
  "p21": "assets/img/products/flavor-hive-special.avif",
  "p22": "assets/img/products/stuff-crust-pizza.avif",
  "p23": "assets/img/products/crown-crust-pizza.webp",
  "p24": "assets/img/products/behari-kebab-pizza.avif",
  "p25": "assets/img/products/malai-boti-pizza.avif",
  "p26": "assets/img/products/chicken-tikka-pizza.avif",
  "p27": "assets/img/products/chicken-fajita-pizza.avif",
  "p28": "assets/img/products/bonfire-pizza.avif",
  "p29": "assets/img/products/vegetable-pizza.avif",
  "p30": "assets/img/products/cheese-lover-pizza.webp",
  "b32": "assets/img/products/chicken-burger.avif",
  "b33": "assets/img/products/chicken-patty-burger.avif",
  "b34": "assets/img/products/zinger-burger.avif",
  "b35": "assets/img/products/chicken-grill-burger.avif",
  "b36": "assets/img/products/chapli-kebab-burger.avif",
  "b37": "assets/img/products/beef-burger.avif",
  "b38": "assets/img/products/fish-burger.avif",
  "b39": "assets/img/products/zinger-tower-burger.avif",
  "k40": "assets/img/products/4-nuggets-fries-drink.avif",
  "k41": "assets/img/products/3-chicken-strips-fries-drink.avif",
  "k42": "assets/img/products/fish-and-chips.avif",
  "s43": "assets/img/products/hot-shot-8-pcs.avif",
  "s44": "assets/img/products/crispy-hot-wings-8-pcs.avif",
  "s45": "assets/img/products/honey-glaze-wings-8-pcs.avif",
  "f_reg": "assets/img/products/regular-fries.avif",
  "f_mas": "assets/img/products/masala-fries.avif",
  "f_gar": "assets/img/products/garlic-fries.avif",
  "f_loa": "assets/img/products/loaded-fries.avif",
  "f_che": "assets/img/products/cheese-fries.avif",
  "f_piz": "assets/img/products/pizza-loaded-fries.avif",
  "sw52": "assets/img/products/vegetable-grilled-sandwich.avif",
  "sw53": "assets/img/products/fh-special-grilled-sandwich.avif",
  "sw54": "assets/img/products/club-sandwich-fries.avif",
  "sw55": "assets/img/products/fh-special-oven-baked.avif",
  "ps56": "assets/img/products/penne-pasta.avif",
  "ps57": "assets/img/products/special-crunchy-pasta.avif",
  "w58": "assets/img/products/chicken-shawarma.avif",
  "w59": "assets/img/products/zinger-shawarma.avif",
  "w60": "assets/img/products/paratha-roll.avif",
  "w61": "assets/img/products/zinger-paratha-roll.avif",
  "w62_wrap": "assets/img/products/tortilla-wrap.avif",
  "w63_plat": "assets/img/products/chicken-platter.avif",
  "br67": "assets/img/products/quarter-broast.avif",
  "br68": "assets/img/products/half-broast.avif",
  "br69": "assets/img/products/full-broast.avif",
};

const DEAL_IMAGES = {
  "d01": "assets/img/deals/deal-01.avif",
  "d02": "assets/img/deals/deal-02.avif",
  "d03": "assets/img/deals/deal-03.avif",
  "d04": "assets/img/deals/deal-04.avif",
  "d05": "assets/img/deals/deal-05.avif",
  "d06": "assets/img/deals/deal-06.avif",
  "d07": "assets/img/deals/deal-07.avif",
  "d08": "assets/img/deals/deal-08.avif",
  "d09": "assets/img/deals/deal-09.avif",
  "d10": "assets/img/deals/deal-10.avif",
  "d11": "assets/img/deals/deal-11.avif",
  "d12": "assets/img/deals/deal-12.avif",
  "d13": "assets/img/deals/deal-13.avif",
  "d14": "assets/img/deals/deal-14.avif",
  "d15": "assets/img/deals/deal-15.avif",
  "d16": "assets/img/deals/deal-16.avif",
  "d17": "assets/img/deals/deal-17.avif",
  "d18": "assets/img/deals/deal-18.avif",
  "d19": "assets/img/deals/deal-19.avif",
  "d20": "assets/img/deals/deal-20.avif",
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
