document.documentElement.classList.add("js");

const pexels = (id, page, photographer, alt, label, focus = "50% 50%") => ({
  imageUrl: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
  imageAlt: alt,
  imageLabel: label,
  imageSourceUrl: `https://www.pexels.com/photo/${page}-${id}/`,
  imageCredit: `Pexels · ${photographer}`,
  imageType: "stock",
  imageFocus: focus,
  semanticImageReview: "pass"
});

const commons = (filePath, pagePath, alt, label, focus = "50% 50%") => ({
  imageUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${filePath}?width=1600`,
  imageAlt: alt,
  imageLabel: label,
  imageSourceUrl: `https://commons.wikimedia.org/wiki/File:${pagePath}`,
  imageCredit: "Wikimedia Commons · commodity reference",
  imageType: "commodity",
  imageFocus: focus,
  semanticImageReview: "pass"
});

const unsplash = (photoId, pageId, credit, alt, label, focus = "50% 50%") => ({
  imageUrl: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=88`,
  imageAlt: alt,
  imageLabel: label,
  imageSourceUrl: `https://unsplash.com/photos/${pageId}`,
  imageCredit: `Unsplash · ${credit}`,
  imageType: "stock",
  imageFocus: focus,
  semanticImageReview: "pass"
});

const PRODUCT_CATALOG = {
  families: [
    {
      id: "whole", number: "01", displayName: "Whole spices", tabLabel: "Whole spices", productLabel: "Whole spice",
      products: [
        {
          id: "green-cardamom", family: "whole", displayName: "Green cardamom", flag: "Initial flagship",
          ...pexels(6086300, "pile-of-green-cardamoms", "Eva Bronzini", "Close view of whole green cardamom pods", "Green cardamom · Whole pods", "50% 46%"),
          brief: "Vayam’s initial flagship demonstrates the wider sourcing method: define the required pod profile, order context and evidence before a source or lot is represented.",
          facts: [["Sourcing form", "Whole green pods; seeds or powder would be separate briefs."], ["Buyer direction", "Pod size or grade direction, colour, appearance, cleanliness and moisture expectations."], ["Order context", "Indicative quantity, intended use, destination and timing."], ["Pack brief", "Inner protection, outer format, pack size and destination labelling."], ["Verification", "Sample, inspection, testing and supplier records as relevant to the agreed enquiry."], ["Commercial note", "Origin, grade, crop context and availability are confirmed only against the specific programme."]],
          enquiryLabel: "Green cardamom", route: "/products/green-cardamom/"
        },
        {
          id: "black-pepper", family: "whole", displayName: "Black pepper",
          ...pexels(5988689, "close-up-photo-of-whole-peppercorns", "Eva Bronzini", "Detailed close view of whole black peppercorns", "Black pepper · Whole peppercorns"),
          brief: "A pepper enquiry connects the required berry profile and end use with quantity, packing, destination and buyer-requested verification.",
          facts: [["Sourcing form", "Whole peppercorns; cracked and ground forms are scoped separately."], ["Physical brief", "Berry size or density direction, colour, cleanliness and moisture."], ["Application", "Table seasoning, sauces, marinades, blends or further processing."], ["Controls", "Analytical and microbiological requirements where relevant to the market."], ["Pack brief", "Quantity, barrier needs, pack size and destination labelling."]],
          enquiryLabel: "Black pepper", route: "/products/black-pepper/"
        },
        {
          id: "cumin-seeds", family: "whole", displayName: "Cumin seeds",
          ...pexels(10487762, "close-up-shot-of-herbs-on-a-spoon", "Victoria Bowers", "Whole cumin seeds displayed in a wooden spoon", "Cumin · Whole seeds", "50% 46%"),
          brief: "Cumin sourcing begins with the buyer’s intended use and physical expectations, then tests feasibility against source, pack and destination needs.",
          facts: [["Product identity", "Whole cumin seed, commonly traded in India as jeera."], ["Physical brief", "Seed size and colour direction, purity, cleanliness and moisture."], ["Application", "Curries, dals, blends, pickling or savoury manufacturing."], ["Verification", "Analytical, residue or microbiological brief where applicable."], ["Pack brief", "Order volume, inner protection and outer format are confirmed per enquiry."]],
          enquiryLabel: "Cumin seeds", route: "/products/cumin-seeds/"
        },
        {
          id: "coriander-seeds", family: "whole", displayName: "Coriander seeds",
          ...commons("Coriander%20Seeds.jpg", "Coriander_Seeds.jpg", "Close view of round dried coriander seeds", "Coriander · Whole seeds"),
          brief: "The coriander brief translates end use into a physical product direction, order quantity, pack and relevant confirmation steps.",
          facts: [["Sourcing form", "Whole dried seed; split and ground formats remain distinct briefs."], ["Physical brief", "Seed size, colour, purity, cleanliness and moisture direction."], ["Application", "Masalas, curries, pickling, bakery or further processing."], ["Market inputs", "Destination requirements and requested product evidence."], ["Pack brief", "Quantity, protective liner and handling format."]],
          enquiryLabel: "Coriander seeds", route: "/products/coriander-seeds/"
        },
        {
          id: "whole-dry-chilli", family: "whole", displayName: "Whole dry chilli",
          ...unsplash("photo-1602237514002-c2d8ae2da393", "red-chili-lot-on-ground-Ia40W5jhINA", "commodity reference", "Close field of whole dried red chillies", "Dry red chilli · Whole pods", "54% 50%"),
          brief: "A whole-chilli enquiry separates heat, colour, aroma and physical form so options can be assessed against the buyer’s actual application.",
          facts: [["Type direction", "Required chilli type or a clear heat-, colour- or aroma-led brief."], ["Physical brief", "Pod and stem condition, cleanliness, moisture and breakage tolerance."], ["Application", "Sauces, pickles, seasoning, flakes or powder processing."], ["Testing", "Heat, colour or other analytical needs where specified by the buyer."], ["Pack brief", "Volume, compression tolerance, liner and outer format."]],
          enquiryLabel: "Whole dry chilli", route: "/products/whole-dry-chilli/"
        },
        {
          id: "cloves", family: "whole", displayName: "Cloves",
          ...pexels(11000777, "close-up-of-dry-herbs", "Piotr Wojnowski", "Detailed close view of whole dried clove buds", "Cloves · Whole dried buds", "50% 48%"),
          brief: "Clove sourcing is framed through bud condition, aromatic profile, order context and evidence relevant to the destination.",
          facts: [["Sourcing form", "Whole dried flower buds; ground clove is a separate programme."], ["Physical brief", "Bud integrity, head and stem condition, colour and cleanliness."], ["Application", "Blends, beverages, bakery, marinades or pickling."], ["Controls", "Moisture and any buyer-requested analytical or microbiological checks."], ["Pack brief", "Order volume, protective pack and destination labelling."]],
          enquiryLabel: "Cloves", route: "/products/cloves/"
        },
        {
          id: "cinnamon-cassia", family: "whole", displayName: "Cinnamon / cassia",
          ...pexels(5475177, "close-up-of-cinnamon-sticks", "Tijana Drndarski", "Close view of rolled cinnamon bark sticks on a dark background", "Cinnamon / cassia · Bark forms"),
          brief: "Cinnamon and cassia are not treated as interchangeable labels: the buyer brief identifies the botanical or commercial type and required bark form.",
          facts: [["Identity", "Requested botanical or commercial type must be made explicit."], ["Sourcing form", "Quill, stick, cut or ground form."], ["Physical brief", "Appearance, dimensions, cleanliness and breakage tolerance."], ["Application", "Bakery, beverages, desserts, savoury blends or food service."], ["Pack brief", "Bark form, volume and handling needs influence the practical format."]],
          enquiryLabel: "Cinnamon / cassia", route: "/products/cinnamon-cassia/"
        },
        {
          id: "fennel-seeds", family: "whole", displayName: "Fennel seeds",
          ...commons("Fennel-seeds.jpg", "Fennel-seeds.jpg", "Close view of whole greenish fennel seeds", "Fennel · Whole seeds"),
          brief: "Fennel enquiries connect the required seed appearance and flavour direction with end use, quantity, packing and market requirements.",
          facts: [["Sourcing form", "Whole dried fennel seed; powder would be separately scoped."], ["Physical brief", "Seed colour and size direction, purity, cleanliness and moisture."], ["Application", "Blends, pickles, bakery, beverages or after-meal preparations."], ["Identity note", "Fennel must remain visually and commercially distinct from cumin."], ["Pack brief", "Quantity, protective pack, handling and destination."]],
          enquiryLabel: "Fennel seeds", route: "/products/fennel-seeds/"
        },
        {
          id: "fenugreek-seeds", family: "whole", displayName: "Fenugreek seeds",
          ...commons("Fenugreek%20seeds.jpg", "Fenugreek_seeds.jpg", "Close view of angular golden fenugreek seeds", "Fenugreek · Whole seeds"),
          brief: "A fenugreek brief defines the whole-seed form, intended processing or application, physical expectations and order requirements.",
          facts: [["Product identity", "Dried whole seed, distinct from fenugreek leaf products."], ["Physical brief", "Seed colour and size direction, purity, cleanliness and moisture."], ["Application", "Curries, pickles, blends or seasoning preparations."], ["Processing", "Intended roasting, grinding or other buyer use helps shape the brief."], ["Pack brief", "Quantity, outer format, inner protection and destination."]],
          enquiryLabel: "Fenugreek seeds", route: "/products/fenugreek-seeds/"
        },
        {
          id: "mustard-seeds", family: "whole", displayName: "Mustard seeds",
          ...pexels(12992319, "bowl-of-mustard-seeds", "Daniela Crucez", "Mustard seeds being poured into a patterned bowl", "Mustard · Whole seeds", "50% 45%"),
          brief: "Mustard sourcing starts by identifying the required species or seed colour and application before physical and commercial parameters are aligned.",
          facts: [["Seed direction", "Yellow, brown or black direction must be identified rather than inferred."], ["Physical brief", "Seed size, purity, cleanliness and moisture."], ["Application", "Tempering, pickles, condiments, marinades or blends."], ["Sourcing form", "Whole, cracked and powder formats require separate handling briefs."], ["Pack brief", "Quantity, protection, pack format and destination requirements."]],
          enquiryLabel: "Mustard seeds", route: "/products/mustard-seeds/"
        }
      ]
    },
    {
      id: "ground", number: "02", displayName: "Ground spices & powders", tabLabel: "Ground spices", productLabel: "Ground spice",
      products: [
        {
          id: "turmeric-powder", family: "ground", displayName: "Turmeric powder",
          ...pexels(6220707, "close-up-of-tumeric-powder", "Karl Solano", "Turmeric powder in small bowls on a wooden surface", "Turmeric · Ground powder"),
          brief: "A turmeric powder programme connects colour and sensory direction with grind, processing, pack and market-specific controls.",
          facts: [["Product brief", "Single-spice turmeric powder."], ["Buyer inputs", "Colour and sensory direction, grind and application."], ["Controls", "Analytical, residue and microbiological requirements as specified."], ["Process records", "Requested treatment or process declarations where relevant."], ["Pack brief", "Barrier, pack size, volume, destination and label inputs."]],
          enquiryLabel: "Turmeric powder", route: "/products/turmeric-powder/"
        },
        {
          id: "chilli-powder", family: "ground", displayName: "Chilli powder",
          ...pexels(33440709, "spicy-red-chili-powder-in-marble-bowl", "Bonaventure Fernandez", "Red chilli powder in a bowl surrounded by whole dried chillies", "Chilli · Ground powder"),
          brief: "Chilli powder is scoped against the intended heat, colour and flavour result, not treated as one universal red-powder standard.",
          facts: [["Product brief", "Single-spice chilli powder or clearly defined chilli direction."], ["Buyer inputs", "Heat, colour, flavour, grind and application."], ["Controls", "Requested analytical, residue and microbiological parameters."], ["Cross-contact", "Any buyer allergen or cross-contact declaration brief."], ["Pack brief", "Barrier, format, volume and destination labelling."]],
          enquiryLabel: "Chilli powder", route: "/products/chilli-powder/"
        },
        {
          id: "coriander-powder", family: "ground", displayName: "Coriander powder",
          ...commons("Coriander%20powder.JPG", "Coriander_powder.JPG", "Close view of ground coriander powder", "Coriander · Ground powder", "50% 46%"),
          imageCredit: "Wikimedia Commons · Nithyasrm · CC BY-SA 4.0",
          semanticImageReview: "replaced-and-reviewed",
          brief: "Coriander powder sourcing begins with the required sensory, colour and grind direction plus the buyer’s processing and market controls.",
          facts: [["Product brief", "Single-spice coriander powder."], ["Buyer inputs", "Colour, aroma, grind, intended use and benchmark if available."], ["Controls", "Purity, moisture and buyer-requested analytical or microbiological needs."], ["Process brief", "Treatment and milling declarations where required."], ["Pack brief", "Barrier, format, order volume and destination."]],
          enquiryLabel: "Coriander powder", route: "/products/coriander-powder/"
        },
        {
          id: "cumin-powder", family: "ground", displayName: "Cumin powder",
          ...pexels(4871244, "brown-powder-on-stainless-steel-spoon", "Kaboompics.com", "Ground cumin powder displayed on a stainless-steel spoon", "Cumin · Ground powder", "50% 50%"),
          semanticImageReview: "replaced-and-reviewed",
          brief: "A cumin powder brief translates the buyer’s aroma, grind and application needs into processing, verification and protective-packing requirements.",
          facts: [["Product brief", "Single-spice ground cumin."], ["Buyer inputs", "Aroma direction, grind, colour and intended application."], ["Controls", "Purity, moisture and requested analytical or microbiological parameters."], ["Process brief", "Milling and treatment declarations where applicable."], ["Pack brief", "Barrier, pack size, quantity and destination."]],
          enquiryLabel: "Cumin powder", route: "/products/cumin-powder/"
        },
        {
          id: "black-pepper-powder", family: "ground", displayName: "Black pepper powder",
          ...commons("Ground%20black%20pepper.jpg", "Ground_black_pepper.jpg", "Close view of ground black pepper powder", "Black pepper · Ground powder", "50% 50%"),
          imageCredit: "Wikimedia Commons · Eliška Jindříšková · CC BY-SA 4.0",
          semanticImageReview: "replaced-and-reviewed",
          brief: "Ground pepper requires an explicit grind, sensory and processing brief because it follows a different handling and verification path from whole peppercorns.",
          facts: [["Product brief", "Ground black pepper, separately scoped from cracked or whole pepper."], ["Buyer inputs", "Grind, pungency and sensory direction, application and benchmark."], ["Controls", "Moisture and requested analytical or microbiological requirements."], ["Process brief", "Treatment and milling declarations where relevant."], ["Pack brief", "Aroma-protective barrier, size, volume and destination."]],
          enquiryLabel: "Black pepper powder", route: "/products/black-pepper-powder/"
        }
      ]
    },
    {
      id: "blends", number: "03", displayName: "Spice blends & masalas", tabLabel: "Blends & masalas", productLabel: "Blend programme",
      products: [
        {
          id: "garam-masala", family: "blends", displayName: "Garam masala",
          ...pexels(2802527, "assorted-cooking-spices", "Shantanu Pal", "Indian whole and ground spices arranged on a dark surface", "Garam masala · Blend context"),
          brief: "Garam masala is approached through an agreed sensory direction, ingredient brief and market format rather than an assumed universal recipe.",
          facts: [["Starting point", "Buyer benchmark, ingredient direction or target sensory profile."], ["Application", "Retail, food service or food manufacturing."], ["Composition", "Ingredient, allergen and additive brief as applicable."], ["Approval path", "Reference alignment and sample review where feasible."], ["Pack brief", "Bulk, food-service or retail format subject to programme fit."]],
          enquiryLabel: "Garam masala", route: "/products/garam-masala/"
        },
        {
          id: "biryani-masala", family: "blends", displayName: "Biryani masala",
          ...pexels(30748997, "traditional-indian-biryani-with-assorted-spices", "Anil Sharma", "Biryani presented with whole Indian spices on a dark table", "Biryani masala · Application context"),
          brief: "A biryani masala brief anchors the blend to the intended dish profile, benchmark, ingredient expectations and buyer format.",
          facts: [["Starting point", "Target style, benchmark or sensory direction."], ["Application", "Retail, food service or manufacturing preparation."], ["Composition", "Ingredient, chilli, salt, allergen and additive direction."], ["Reference", "Sample or benchmark alignment where appropriate."], ["Pack brief", "Bulk, food-service or retail size, volume and labels."]],
          enquiryLabel: "Biryani masala", route: "/products/biryani-masala/"
        },
        {
          id: "curry-seasoning", family: "blends", displayName: "Curry / seasoning blends",
          ...pexels(7208238, "close-up-shot-of-bowls-of-powder-condiments", "Pranjall Kumar", "Assorted ground Indian spices arranged in metal bowls on a dark background", "Curry and seasoning · Blend context"),
          brief: "Curry and seasoning programmes are defined by application and market expectations, with composition and sensory direction made explicit.",
          facts: [["Starting point", "Application, benchmark or target flavour direction."], ["Use context", "Sauce, snack, ready meal, food service or retail."], ["Composition", "Ingredient, allergen, additive and salt brief."], ["Controls", "Sensory, analytical and microbiological needs where requested."], ["Pack brief", "Format, volume, barrier and label inputs."]],
          enquiryLabel: "Curry / seasoning blends", route: "/products/curry-seasoning-blends/"
        },
        {
          id: "sambar-style-blend", family: "blends", displayName: "Sambar-style blend",
          ...pexels(35041639, "indian-sambar-in-stainless-steel-pot", "Milton Das", "South Indian vegetable sambar in a stainless steel serving pot", "Sambar-style · Application context", "50% 48%"),
          brief: "A sambar-style brief captures the buyer’s flavour benchmark, chilli and pulse-component direction, application and target format.",
          facts: [["Starting point", "Benchmark, regional style direction or target sensory profile."], ["Composition", "Spice, chilli, pulse component, salt and ingredient expectations."], ["Application", "Food service, retail or manufacturing."], ["Approval path", "Reference and sample alignment where feasible."], ["Pack brief", "Bulk, food-service or retail format and volume."]],
          enquiryLabel: "Sambar-style blend", route: "/products/sambar-style-blend/"
        },
        {
          id: "buyer-specified-blend", family: "blends", displayName: "Buyer-specified formulation", flag: "Specification-led",
          ...pexels(4198929, "assorted-spices-in-white-metal-bowl", "Kaboompics", "Measured ground ingredients arranged for formulation work", "Buyer-specified · Formulation context"),
          brief: "For a buyer-specified formulation, Vayam first clarifies ownership of the brief, benchmark, permitted ingredients and approval path before feasibility is represented.",
          facts: [["Starting point", "Recipe direction, benchmark, restricted brief or target outcome."], ["Governance", "Formula ownership, confidentiality and change control need agreement."], ["Composition", "Ingredient, allergen, additive and market restrictions."], ["Approval path", "Development samples, feedback rounds and final reference where feasible."], ["Commercial fit", "MOQ, format, supplier capability and timing remain subject to confirmation."]],
          enquiryLabel: "Buyer-specified spice formulation", route: "/products/buyer-specified-blends/"
        }
      ]
    },
    {
      id: "staples", number: "04", displayName: "Rice, pulses, millets & grains", tabLabel: "Staples & grains", productLabel: "Indian staple",
      products: [
        {
          id: "basmati-rice", family: "staples", displayName: "Basmati rice",
          ...pexels(7421207, "rice-grains-on-a-brown-paper", "Vie Studio", "Uncooked long-grain basmati rice spread on brown paper", "Basmati rice · Raw long grain"),
          brief: "A basmati enquiry identifies the required variety or reference, processing direction, end market, order size, pack and evidence before options are assessed.",
          facts: [["Category", "Aromatic long-grain rice; ‘basmati’ alone is not a complete specification."], ["Buyer inputs", "Variety or reference and raw, parboiled or other processing direction."], ["Quality brief", "Grain, sensory, age or other parameters supplied by the buyer."], ["Market inputs", "Destination and requested testing or records."], ["Pack brief", "Bulk, food-service or retail format, volume and labels."]],
          enquiryLabel: "Basmati rice", route: "/products/basmati-rice/"
        },
        {
          id: "sona-masoori-rice", family: "staples", displayName: "Sona Masoori rice", flag: "Distinct rice direction",
          ...pexels(18328392, "grains-of-rice", "Petr Ganaj", "Detailed close view of uncooked white rice grains", "Sona Masoori · Raw rice grain", "50% 44%"),
          brief: "Sona Masoori is treated as a distinct Indian medium-grain rice direction—not generic basmati copy—with its own cooking use, processing, market and packing brief.",
          facts: [["Category", "Indian medium-grain, non-basmati rice direction; the photograph is a category reference, not a confirmed lot."], ["Buyer inputs", "Required product reference and raw, steamed, parboiled or other processing direction."], ["Use context", "Everyday retail, food-service or wholesale application and expected cooking result."], ["Market inputs", "Order volume, destination and requested quality or transaction records."], ["Pack brief", "Bulk, food-service or retail format and label inputs."]],
          enquiryLabel: "Sona Masoori rice", route: "/products/sona-masoori-rice/"
        },
        {
          id: "pulses", family: "staples", displayName: "Pulses",
          ...commons("Mixture%20of%20beans%20%28small%20red%2C%20cannellini%2C%20pinto%2C%20roman%2C%20red%20kidney%2C%20black%29%2C%20peas%20%28blackeye%2C%20yellow%20split%29%2C%20and%20pardina%20lentils%2021.jpg", "Mixture_of_beans_(small_red,_cannellini,_pinto,_roman,_red_kidney,_black),_peas_(blackeye,_yellow_split),_and_pardina_lentils_21.jpg", "Assorted whole and split pulses including beans, peas and lentils", "Pulses · Category context"),
          brief: "Pulse sourcing starts with the exact crop and form—such as lentils, chickpeas, whole pulses or dals/split pulses—then aligns quality, pack and market needs without implying fixed inventory.",
          facts: [["Product identity", "Exact pulse, variety or trade reference and whole, split, polished or unpolished form."], ["Physical brief", "Size, colour, uniformity, defects, foreign matter and moisture direction."], ["Application", "Retail, food service, wholesale or ingredient processing."], ["Controls", "Requested testing, treatment declarations and destination records."], ["Pack brief", "Bulk or retail direction, size, liner and labels."]],
          enquiryLabel: "Pulses", route: "/products/pulses/"
        },
        {
          id: "millets-grains", family: "staples", displayName: "Millets & other grains",
          ...commons("A%20closeup%20of%20Pearl%20Millet%20%28Cumbu%29.JPG", "A_closeup_of_Pearl_Millet_(Cumbu).JPG", "Close view of pearl millet grains", "Millets · Pearl millet category reference"),
          imageCredit: "Wikimedia Commons · Thamizhpparithi Maari · CC BY-SA 3.0",
          semanticImageReview: "replaced-and-reviewed",
          brief: "Millet and grain enquiries are kept product-specific: pearl millet is shown as one category reference, while the exact crop, form, end use, quantity and destination determine the sourcing path.",
          facts: [["Product identity", "Name the exact millet or grain; pearl millet is one possible direction, not implied stock."], ["Physical brief", "Size, colour, purity, foreign matter, moisture and processing direction."], ["Application", "Ingredient, food service, wholesale or retail."], ["Controls", "Buyer-requested testing and destination documentation."], ["Pack brief", "Bulk, food-service or retail format subject to product fit."]],
          enquiryLabel: "Millets & other grains", route: "/products/millets-grains/"
        }
      ]
    },
    {
      id: "packaged", number: "05", displayName: "Packaged Indian foods", tabLabel: "Packaged foods", productLabel: "Packaged-food direction",
      products: [
        {
          id: "packaged-spices-masalas", family: "packaged", displayName: "Packaged spices & masalas",
          ...pexels(458796, "clear-glass-jar-lot", "monicore", "A coordinated collection of spices presented in clear food jars", "Packaged spices · Range context", "50% 48%"),
          semanticImageReview: "replaced-and-reviewed",
          brief: "Packaged spice sourcing can begin from an existing supplier range or a buyer format brief, with product, label, pack and market requirements reviewed together.",
          facts: [["Range direction", "Single spices, masalas or seasonings."], ["Commercial path", "Existing supplier range or buyer-specific format exploration."], ["Pack inputs", "Material direction, size, closure, case pack and shelf presentation."], ["Label inputs", "Destination language, declarations and buyer artwork responsibilities."], ["Confirmation", "Supplier, range, MOQ and market fit remain enquiry-specific."]],
          enquiryLabel: "Packaged spices & masalas", route: "/products/packaged-spices-masalas/"
        },
        {
          id: "packaged-rice-staples", family: "packaged", displayName: "Packaged rice & staples",
          ...pexels(3737694, "white-rice-on-reusable-bag", "cottonbro studio", "Rice, pulses and grains portioned into separate reusable food bags", "Packaged staples · Food-pack context", "50% 52%"),
          brief: "Packaged rice and staples require the underlying product specification and consumer pack to be assessed as one programme.",
          facts: [["Range direction", "Rice, pulses, millets or other agreed staple products."], ["Product brief", "Exact commodity and processing or quality direction."], ["Pack inputs", "Consumer size, material, closure, case pack and pallet considerations."], ["Label inputs", "Market declarations, languages, artwork and coding needs."], ["Confirmation", "Format, supplier capability and MOQ are confirmed per enquiry."]],
          enquiryLabel: "Packaged rice & staples", route: "/products/packaged-rice-staples/"
        },
        {
          id: "indian-grocery-foodservice", family: "packaged", displayName: "Indian grocery / food-service",
          ...pexels(6994943, "bags-of-uncooked-macaroni-pasta-beside-canned-foods-and-slices-of-bread", "Julia M Cameron", "Packaged pantry staples and canned foods arranged as grocery-range context", "Indian grocery · Range context", "50% 48%"),
          semanticImageReview: "replaced-and-reviewed",
          brief: "A grocery or food-service enquiry is structured as a defined range, destination and operating format—not an open-ended promise to supply every item.",
          facts: [["Range brief", "Named products, brands or functional categories."], ["Buyer context", "Retail, wholesale, cash-and-carry or food service."], ["Consolidation", "SKU count, quantities, case packs and shipment logic."], ["Market inputs", "Destination, shelf-life expectations and label review needs."], ["Confirmation", "Brand permissions, availability and commercial fit remain item-specific."]],
          enquiryLabel: "Indian grocery / food-service range", route: "/products/indian-grocery-foodservice/"
        },
        {
          id: "buyer-specified-packaged-foods", family: "packaged", displayName: "Buyer-specified packaged foods",
          ...pexels(12024976, "two-stand-up-zipper-pouch-on-white-surface", "Mr. Mockup", "Two blank sealed stand-up pouches representing buyer-specified food packaging", "Buyer-specified foods · Pack context", "50% 50%"),
          semanticImageReview: "replaced-and-reviewed",
          brief: "For a buyer-specified packaged food, the product, benchmark, pack, label responsibilities and supplier feasibility must be clarified before development is represented.",
          facts: [["Starting point", "Named product, benchmark or functional brief."], ["Product inputs", "Ingredients, sensory direction, allergens and permitted claims."], ["Pack inputs", "Format, size, material, case pack and target presentation."], ["Approval path", "Samples, artwork, label review and final reference where feasible."], ["Commercial fit", "Capability, MOQ, timing and destination remain subject to confirmation."]],
          enquiryLabel: "Buyer-specified packaged foods", route: "/products/buyer-specified-packaged-foods/"
        }
      ]
    },
    {
      id: "private", number: "06", displayName: "Private label & buyer-specific", tabLabel: "Private label", productLabel: "Buyer-specific service",
      products: [
        {
          id: "retail-private-label-packs", family: "private", displayName: "Retail private-label packs",
          ...pexels(12039675, "paper-bag-on-white-background", "mockupbee", "Unbranded sealed pouch representing a retail private-label pack", "Private label · Retail pack context"),
          brief: "Retail private label begins with the product and target shelf proposition, then tests pack, artwork, supplier and order-volume feasibility.",
          facts: [["Product scope", "Named spice, blend, staple or packaged-food direction."], ["Retail brief", "Target consumer, pack size, shelf context and destination."], ["Artwork roles", "Brand assets, label copy, regulatory review and approvals must be assigned."], ["Approval path", "Product reference, packaging sample and artwork proof where feasible."], ["Commercial fit", "Supplier capability, MOQ and timing are confirmed programme by programme."]],
          enquiryLabel: "Retail private-label packs", route: "/services/retail-private-label/"
        },
        {
          id: "food-service-packs", family: "private", displayName: "Food-service packs",
          ...pexels(31570363, "coffee-beans-packaging-in-industrial-setting", "Masud Allahverdizade", "Gloved hands filling a food pouch in a clean commercial packing workspace", "Buyer-specific · Food-service pack context", "50% 48%"),
          brief: "Food-service programmes prioritize product consistency, working pack size, handling and case configuration around the buyer’s operation.",
          facts: [["Product scope", "Named spice, blend, rice, staple or other defined product."], ["Use context", "Kitchen, catering, ingredient station or distribution workflow."], ["Pack brief", "Working size, closure, barrier, case count and handling."], ["Controls", "Product reference and requested transaction-specific evidence."], ["Commercial fit", "Volume, format and supplier capability require confirmation."]],
          enquiryLabel: "Food-service packs", route: "/services/food-service-packs/"
        },
        {
          id: "buyer-specific-pack-formats", family: "private", displayName: "Buyer-specific pack formats",
          ...pexels(7657839, "a-person-in-blue-denim-jeans-holding-a-plastic-pack-with-coffee-beans", "Cup of Couple", "Hands holding a clear food pouch filled with coffee beans as packaging-format context", "Buyer-specific · Food-pouch format", "50% 48%"),
          semanticImageReview: "replaced-and-reviewed",
          brief: "A buyer-specific pack format is explored against product protection, filling capability, material direction, destination and practical order volume.",
          facts: [["Starting point", "Existing pack reference, dimension brief or target use."], ["Product fit", "Barrier, closure, fill weight and handling requirements."], ["Supplier fit", "Available machinery, materials and trial capability."], ["Approval path", "Blank sample, artwork proof and filled reference where feasible."], ["Commercial fit", "Tooling, MOQ, lead time and cost remain subject to confirmation."]],
          enquiryLabel: "Buyer-specific pack formats", route: "/services/buyer-specific-pack-formats/"
        },
        {
          id: "consolidated-multi-product", family: "private", displayName: "Consolidated / multi-product sourcing",
          ...pexels(5775099, "stacks-of-cardboard-boxes", "Handi Boyz LLC", "Organised warehouse aisle with stacked cartons prepared for coordinated handling", "Consolidated sourcing · Multi-product context", "50% 50%"),
          brief: "A consolidated programme starts with a controlled SKU and supplier map so compatibility, quantities, timing and documentation can be assessed before shipment planning.",
          facts: [["Range brief", "Named SKUs, required quantities and acceptable alternatives."], ["Supplier map", "Single- or multi-supplier feasibility and responsibility boundaries."], ["Compatibility", "Food safety, odour, pack, handling and shelf-life considerations."], ["Consolidation plan", "Case data, readiness dates, labels and transaction records."], ["Commercial fit", "Consolidation and shipment structure are confirmed only after feasibility review."]],
          enquiryLabel: "Consolidated / multi-product sourcing", route: "/services/consolidated-sourcing/"
        }
      ]
    }
  ]
};

const SOURCING_STAGES = {
  requirement: ["01 / 05", "Product, specification, application, quantity, packing, destination and timing become one working buyer brief.", "Working output · Structured sourcing requirement"],
  source: ["02 / 05", "Relevant product and supplier directions are assessed against the brief, with feasibility and unknowns kept visible.", "Working output · Sourcing options for review"],
  verify: ["03 / 05", "Samples, reference alignment, available supplier records, inspection or testing are coordinated where applicable.", "Working output · Aligned product reference"],
  confirm: ["04 / 05", "The selected product, specification, quantity, packing, commercial terms and agreed checks are confirmed together.", "Working output · Confirmed order basis"],
  dispatch: ["05 / 05", "Packing readiness, relevant transaction documents, customs, logistics and dispatch coordination are brought into one final path.", "Working output · Dispatch-ready transaction"]
};

const allProducts = () => PRODUCT_CATALOG.families.flatMap((family) => family.products);
const findFamily = (id) => PRODUCT_CATALOG.families.find((family) => family.id === id);
const findProduct = (id) => allProducts().find((product) => product.id === id);
const pad = (value) => String(value).padStart(2, "0");

const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const mainContent = document.querySelector("main");
const footer = document.querySelector(".site-footer");
const menuButton = document.querySelector("[data-menu-button]");
const mobileNavigation = document.querySelector("[data-mobile-navigation]");
const productsToggle = document.querySelector("[data-products-toggle]");
const productsDropdown = document.querySelector("[data-products-dropdown]");
let lastFocusedElement = null;

const setHeaderState = () => {
  if (!header) return;
  const compactAt = 16;
  const creamAt = hero ? Math.max(compactAt, hero.offsetTop + hero.offsetHeight - 72) : 80;
  const isCompact = window.scrollY >= compactAt;
  const isPastHero = window.scrollY >= creamAt;
  header.classList.toggle("is-compact", isCompact);
  header.classList.toggle("is-hero-scrolling", isCompact && !isPastHero);
  header.classList.toggle("is-scrolled", isPastHero);
};

const closeProductsDropdown = ({ restoreFocus = false } = {}) => {
  if (!productsToggle || !productsDropdown || !header) return;
  productsToggle.setAttribute("aria-expanded", "false");
  productsDropdown.hidden = true;
  header.classList.remove("dropdown-open");
  if (restoreFocus) productsToggle.focus();
};

const openProductsDropdown = () => {
  if (!productsToggle || !productsDropdown || !header) return;
  productsToggle.setAttribute("aria-expanded", "true");
  productsDropdown.hidden = false;
  header.classList.add("dropdown-open");
};

const setBackgroundInert = (state) => [mainContent, footer].forEach((element) => {
  if (element) element.inert = state;
});

const closeMobileMenu = ({ restoreFocus = false } = {}) => {
  if (!menuButton || !mobileNavigation || !header) return;
  mobileNavigation.classList.remove("is-open");
  mobileNavigation.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  setBackgroundInert(false);
  if (restoreFocus && lastFocusedElement) lastFocusedElement.focus();
};

const openMobileMenu = () => {
  if (!menuButton || !mobileNavigation || !header) return;
  lastFocusedElement = document.activeElement;
  mobileNavigation.hidden = false;
  mobileNavigation.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation menu");
  header.classList.add("menu-active");
  document.body.classList.add("menu-open");
  setBackgroundInert(true);
  mobileNavigation.querySelector("a[href]")?.focus();
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", setHeaderState);

if (productsToggle && productsDropdown) {
  productsToggle.addEventListener("click", () => productsToggle.getAttribute("aria-expanded") === "true" ? closeProductsDropdown() : openProductsDropdown());
  document.addEventListener("click", (event) => {
    if (!productsDropdown.hidden && !event.target.closest(".products-menu")) closeProductsDropdown();
  });
}

if (menuButton && mobileNavigation) {
  menuButton.addEventListener("click", () => menuButton.getAttribute("aria-expanded") === "true" ? closeMobileMenu() : openMobileMenu());
  mobileNavigation.querySelectorAll("a[href]").forEach((link) => link.addEventListener("click", () => closeMobileMenu()));
}

document.addEventListener("keydown", (event) => {
  const mobileOpen = menuButton?.getAttribute("aria-expanded") === "true";
  const dropdownOpen = productsToggle?.getAttribute("aria-expanded") === "true";
  if (event.key === "Escape") {
    if (mobileOpen) return closeMobileMenu({ restoreFocus: true });
    if (dropdownOpen) closeProductsDropdown({ restoreFocus: true });
  }
  if (event.key === "Tab" && mobileOpen && mobileNavigation && menuButton) {
    const focusable = [menuButton, ...mobileNavigation.querySelectorAll("a[href]")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024 && menuButton?.getAttribute("aria-expanded") === "true") closeMobileMenu();
});

const explorer = document.querySelector("[data-product-explorer]");
const familyTabsContainer = document.querySelector("[data-family-tabs]");
const productTabsContainer = document.querySelector("[data-product-tabs]");
const rfqProduct = document.querySelector("[data-rfq-product]");
const rfqContextId = document.querySelector("[data-rfq-context-id]");
const rfqContext = document.querySelector("[data-rfq-context]");
let activeFamilyId = "whole";
let activeProductId = "green-cardamom";

const setRovingState = (tabs, selectedId, dataKey) => tabs.forEach((tab) => {
  const selected = tab.dataset[dataKey] === selectedId;
  tab.setAttribute("aria-selected", String(selected));
  tab.tabIndex = selected ? 0 : -1;
});

const bindRovingKeyboard = (container, getTabs, orientation, activate) => {
  container.onkeydown = (event) => {
    const tabs = getTabs();
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const previous = orientation() === "vertical" ? "ArrowUp" : "ArrowLeft";
    const next = orientation() === "vertical" ? "ArrowDown" : "ArrowRight";
    let target = current;
    if (event.key === previous) target = (current - 1 + tabs.length) % tabs.length;
    if (event.key === next) target = (current + 1) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    if (target !== current) {
      event.preventDefault();
      tabs[target].focus();
      activate(tabs[target]);
    }
  };
};

const renderFamilyTabs = () => {
  if (!familyTabsContainer) return;
  familyTabsContainer.innerHTML = PRODUCT_CATALOG.families.map((family, index) => `<button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-family="${family.id}">${family.tabLabel}</button>`).join("");
  familyTabsContainer.querySelectorAll("[data-family]").forEach((tab) => tab.addEventListener("click", () => selectFamily(tab.dataset.family)));
  bindRovingKeyboard(familyTabsContainer, () => [...familyTabsContainer.querySelectorAll("[data-family]")], () => "horizontal", (tab) => selectFamily(tab.dataset.family));
};

const renderProductTabs = (family) => {
  if (!productTabsContainer) return;
  productTabsContainer.setAttribute("aria-label", `${family.displayName} products`);
  productTabsContainer.innerHTML = family.products.map((product, index) => `<button type="button" role="tab" aria-selected="false" tabindex="-1" data-product="${product.id}"><span>${pad(index + 1)}</span>${product.displayName}${product.flag ? `<small>${product.flag}</small>` : ""}</button>`).join("");
  productTabsContainer.querySelectorAll("[data-product]").forEach((tab) => tab.addEventListener("click", () => selectProduct(tab.dataset.product)));
  bindRovingKeyboard(productTabsContainer, () => [...productTabsContainer.querySelectorAll("[data-product]")], () => window.innerWidth <= 820 ? "horizontal" : "vertical", (tab) => selectProduct(tab.dataset.product));
};

const buildFacts = (product) => product.facts.filter(([term, detail]) => term && detail).slice(0, 6);

const updateRfqContext = (product, lead = "Selected from Product Explorer") => {
  if (!product || !rfqProduct) return;
  rfqProduct.value = product.id;
  if (rfqContextId) rfqContextId.value = product.id;
  if (rfqContext) {
    rfqContext.hidden = false;
    rfqContext.textContent = `${lead}: ${product.enquiryLabel}. You can refine the specification below.`;
  }
};

const selectProduct = (productId, { focus = false } = {}) => {
  const product = findProduct(productId);
  if (!product || !explorer) return false;
  const family = findFamily(product.family);
  if (!family) return false;
  if (activeFamilyId !== family.id || !productTabsContainer.querySelector(`[data-product="${product.id}"]`)) {
    activeFamilyId = family.id;
    renderProductTabs(family);
  }
  activeProductId = product.id;
  setRovingState([...familyTabsContainer.querySelectorAll("[data-family]")], family.id, "family");
  const productTabs = [...productTabsContainer.querySelectorAll("[data-product]")];
  setRovingState(productTabs, product.id, "product");
  if (focus) productTabs.find((tab) => tab.dataset.product === product.id)?.focus();

  explorer.dataset.selectedFamily = family.id;
  explorer.dataset.selectedProduct = product.id;
  explorer.querySelector("[data-family-number]").textContent = family.number;
  explorer.querySelector("[data-family-title]").textContent = family.displayName;
  explorer.querySelector("[data-product-family]").textContent = family.productLabel;
  explorer.querySelector("[data-product-flag]").textContent = product.flag || "";
  explorer.querySelector("[data-product-title]").textContent = product.displayName;
  explorer.querySelector("[data-product-summary]").textContent = product.brief;
  explorer.querySelector("[data-product-facts]").innerHTML = buildFacts(product).map(([term, detail]) => `<div><dt>${term}</dt><dd>${detail}</dd></div>`).join("");
  explorer.querySelector("[data-route-preview]").textContent = product.route;
  const image = explorer.querySelector("[data-explorer-image]");
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.imageAlt);
  image.dataset.imageType = product.imageType;
  image.style.objectPosition = product.imageFocus || "50% 50%";
  explorer.querySelector("[data-image-label]").textContent = product.imageLabel;
  const credit = explorer.querySelector("[data-image-credit]");
  credit.textContent = product.imageCredit;
  credit.hidden = !product.imageSourceUrl;
  credit.setAttribute("href", product.imageSourceUrl || "#products");
  const index = family.products.findIndex((item) => item.id === product.id);
  explorer.querySelector("[data-active-index]").textContent = pad(index + 1);
  explorer.querySelector("[data-total-index]").textContent = `/ ${pad(family.products.length)}`;
  const cta = explorer.querySelector("[data-product-enquiry]");
  cta.textContent = `Build enquiry for ${product.displayName}`;
  cta.dataset.productId = product.id;
  cta.setAttribute("aria-label", `Build a sourcing enquiry for ${product.displayName}`);
  return true;
};

const selectFamily = (familyId, preferredProductId) => {
  const family = findFamily(familyId);
  if (!family) return false;
  activeFamilyId = family.id;
  renderProductTabs(family);
  const preferred = preferredProductId && findProduct(preferredProductId)?.family === family.id ? preferredProductId : family.products[0].id;
  return selectProduct(preferred);
};

const renderCatalogueNavigation = () => {
  const whole = findFamily("whole");
  const wholeDropdown = document.querySelector("[data-dropdown-whole]");
  const familyDropdown = document.querySelector("[data-dropdown-families]");
  const wholeRange = document.querySelector("[data-whole-range]");
  if (wholeDropdown) wholeDropdown.innerHTML = whole.products.map((product) => `<a href="#products" data-product-jump="${product.id}">${product.displayName}</a>`).join("");
  if (familyDropdown) familyDropdown.innerHTML = PRODUCT_CATALOG.families.filter((family) => family.id !== "whole").map((family) => `<section class="dropdown-family-block"><span>${family.displayName}</span>${family.products.map((product) => `<a href="#products" data-product-jump="${product.id}">${product.displayName}</a>`).join("")}</section>`).join("");
  if (wholeRange) wholeRange.innerHTML = whole.products.map((product) => `<li>${product.displayName}</li>`).join("");
  document.querySelectorAll("[data-product-jump]").forEach((link) => link.addEventListener("click", () => {
    selectProduct(link.dataset.productJump);
    closeProductsDropdown();
  }));
};

const renderRfqOptions = () => {
  if (!rfqProduct) return;
  PRODUCT_CATALOG.families.forEach((family) => {
    const group = document.createElement("optgroup");
    group.label = family.displayName;
    family.products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = product.enquiryLabel;
      group.append(option);
    });
    rfqProduct.append(group);
  });
  rfqProduct.addEventListener("change", () => {
    const product = findProduct(rfqProduct.value);
    if (product) updateRfqContext(product, "Selected product");
    else {
      if (rfqContextId) rfqContextId.value = "";
      if (rfqContext) rfqContext.hidden = true;
    }
  });
};

renderFamilyTabs();
renderCatalogueNavigation();
renderRfqOptions();
selectFamily("whole", "green-cardamom");

explorer?.querySelector("[data-product-enquiry]")?.addEventListener("click", (event) => {
  const product = findProduct(event.currentTarget.dataset.productId);
  if (product) updateRfqContext(product);
});

const requestedProduct = new URLSearchParams(window.location.search).get("product");
if (requestedProduct && findProduct(requestedProduct)) selectProduct(requestedProduct);

const getExplorerSnapshot = () => ({
  id: explorer?.dataset.selectedProduct || "",
  familyId: explorer?.dataset.selectedFamily || "",
  familyLabel: explorer?.querySelector("[data-product-family]")?.textContent || "",
  activeFamilyTab: familyTabsContainer?.querySelector('[aria-selected="true"]')?.dataset.family || "",
  activeSubtypeTab: productTabsContainer?.querySelector('[aria-selected="true"]')?.dataset.product || "",
  title: explorer?.querySelector("[data-product-title]")?.textContent || "",
  imageSrc: explorer?.querySelector("[data-explorer-image]")?.getAttribute("src") || "",
  imageAlt: explorer?.querySelector("[data-explorer-image]")?.getAttribute("alt") || "",
  brief: explorer?.querySelector("[data-product-summary]")?.textContent || "",
  facts: [...(explorer?.querySelectorAll("[data-product-facts] > div") || [])].map((row) => [row.querySelector("dt")?.textContent || "", row.querySelector("dd")?.textContent || ""]),
  cta: explorer?.querySelector("[data-product-enquiry]")?.textContent || "",
  ctaProductId: explorer?.querySelector("[data-product-enquiry]")?.dataset.productId || "",
  rfqValue: rfqProduct?.value || "",
  rfqLabel: rfqProduct?.selectedOptions?.[0]?.textContent || "",
  rfqContextId: rfqContextId?.value || ""
});

const verifyExplorer = () => {
  const restoreId = activeProductId;
  const restoreRfq = rfqProduct?.value || "";
  const restoreContextId = rfqContextId?.value || "";
  const restoreContextText = rfqContext?.textContent || "";
  const restoreContextHidden = rfqContext?.hidden ?? true;
  const products = allProducts();
  const results = products.map((product, index) => {
    const sentinel = products[(index + products.length - 1) % products.length];
    selectProduct(sentinel.id);
    selectProduct(product.id);
    updateRfqContext(product, "Verification selection");
    const rendered = getExplorerSnapshot();
    const family = findFamily(product.family);
    const expected = {
      id: product.id, familyId: product.family, familyLabel: family.productLabel,
      activeFamilyTab: product.family, activeSubtypeTab: product.id, title: product.displayName,
      imageSrc: product.imageUrl, imageAlt: product.imageAlt, brief: product.brief,
      facts: buildFacts(product), cta: `Build enquiry for ${product.displayName}`,
      ctaProductId: product.id, rfqValue: product.id, rfqLabel: product.enquiryLabel, rfqContextId: product.id
    };
    const checks = Object.fromEntries(Object.keys(expected).map((key) => [key, JSON.stringify(rendered[key]) === JSON.stringify(expected[key])]));
    checks.usefulContent = rendered.facts.length >= 4 && rendered.facts.length <= 6 && rendered.facts.every(([term, detail]) => term.trim() && detail.trim());
    checks.staleFree = rendered.id !== sentinel.id && rendered.title !== sentinel.displayName && !rendered.facts.some((row) => row.includes(sentinel.brief));
    return { id: product.id, family: product.family, passed: Object.values(checks).every(Boolean), checks, expected, rendered };
  });
  selectProduct(restoreId);
  if (rfqProduct) rfqProduct.value = restoreRfq;
  if (rfqContextId) rfqContextId.value = restoreContextId;
  if (rfqContext) {
    rfqContext.textContent = restoreContextText;
    rfqContext.hidden = restoreContextHidden;
  }
  return { passed: results.every((result) => result.passed), tested: results.length, results };
};

window.VayamExplorer = Object.freeze({
  catalog: PRODUCT_CATALOG,
  selectFamily,
  selectProduct,
  getManifest: () => allProducts().map((product) => ({
    id: product.id, family: product.family, title: product.displayName,
    imageSrc: product.imageUrl, imageAlt: product.imageAlt, imageType: product.imageType,
    imageSourceUrl: product.imageSourceUrl, imageCredit: product.imageCredit,
    semanticImageReview: product.semanticImageReview || "pass",
    brief: product.brief, usefulFields: buildFacts(product),
    contentFields: buildFacts(product).map(([term]) => term), route: product.route,
    cta: `Build enquiry for ${product.displayName}`, ctaProductId: product.id,
    rfqValue: product.id, rfqLabel: product.enquiryLabel
  })),
  getSnapshot: getExplorerSnapshot,
  verifyAll: verifyExplorer
});

const sourcingPath = document.querySelector("[data-sourcing-path]");
const stageDetail = document.querySelector("[data-stage-detail]");
if (sourcingPath && stageDetail) {
  const buttons = [...sourcingPath.querySelectorAll("button[data-stage]")];
  const selectStage = (button) => {
    const stage = SOURCING_STAGES[button.dataset.stage];
    if (!stage) return;
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute("aria-pressed", String(selected));
      item.closest("li").classList.toggle("is-current", selected);
    });
    stageDetail.querySelector("[data-stage-number]").textContent = stage[0];
    stageDetail.querySelector("[data-stage-copy]").textContent = stage[1];
    stageDetail.querySelector("[data-stage-output]").textContent = stage[2];
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => selectStage(button));
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) button.addEventListener("pointerenter", () => selectStage(button));
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, revealObserver) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }), { rootMargin: "0px 0px -6%", threshold: 0.06 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const tradeMap = document.querySelector("[data-trade-map]");
if (tradeMap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  tradeMap.classList.add("map-ready");
  if ("IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) {
        tradeMap.classList.add("is-revealed");
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    mapObserver.observe(tradeMap);
  } else tradeMap.classList.add("is-revealed");
}

const rfqForm = document.querySelector("[data-rfq-form]");
const formStatus = document.querySelector("[data-form-status]");
if (rfqForm && formStatus) rfqForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!rfqForm.reportValidity()) return;
  formStatus.textContent = "Your sourcing brief is structured and ready for follow-up. This V3 concept does not transmit information yet.";
  formStatus.classList.add("is-visible");
  formStatus.focus();
});

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();
