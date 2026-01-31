/* =========================
IMOR Catalog Data (CATALOG_TREE)
- IMPORTANT: Leaf node key = catalogKey (backend category) bo‘lishi kerak!
========================= */

const IMG = {
  brick:
    "https://images.unsplash.com/photo-1581091012184-5cce7f3c1a3b?auto=format&fit=crop&w=1400&q=80",
  cement:
    "https://images.unsplash.com/photo-1603570417599-3f2f1f6b6f1a?auto=format&fit=crop&w=1400&q=80",
  rebar:
    "https://images.unsplash.com/photo-1611273426858-450d8f3c6130?auto=format&fit=crop&w=1400&q=80",
  blocks:
    "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=80",
  lumber:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
  paint:
    "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80",
  pipes:
    "https://images.unsplash.com/photo-1612988952180-2aa8a3b9fbde?auto=format&fit=crop&w=1400&q=80",
  electrical:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
  tools:
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1400&q=80",
  safety:
    "https://images.unsplash.com/photo-1581092334704-3bf26531a5c7?auto=format&fit=crop&w=1400&q=80",
  tiles:
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1400&q=80",
  roofing:
    "https://images.unsplash.com/photo-1501696461400-7c9f4b6c9a71?auto=format&fit=crop&w=1400&q=80",
};

export const MANUFACTURERS = [
  "O‘zbekiston",
  "Rossiya",
  "Turkiya",
  "Xitoy",
  "Germaniya",
  "Italiya",
  "Qozog‘iston",
];

export const CATALOG_TREE = [
  {
    key: "materials",
    title: "Qurilish materiallari",
    img: IMG.blocks,
    children: [
      { key: "brick", title: "G‘isht", img: IMG.brick }, // ✅ leaf
      { key: "cement", title: "Sement", img: IMG.cement }, // ✅ leaf
      { key: "rebar", title: "Armatura", img: IMG.rebar }, // ✅ leaf
      { key: "blocks", title: "Blok va gazobeton", img: IMG.blocks }, // ✅ leaf
      { key: "sand", title: "Qum", img: "https://images.unsplash.com/photo-1616353071855-2d4f3b6a2a1c?auto=format&fit=crop&w=1400&q=80" },
      { key: "gravel", title: "Shag‘al", img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80" },
    ],
  },

  {
    key: "finishing",
    title: "Sopol va pardoz",
    img: IMG.tiles,
    children: [
      { key: "tiles", title: "Plitka", img: IMG.tiles },
      { key: "adhesive", title: "Plitka yelimi", img: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=80" },
      { key: "putty", title: "Shpatlyovka", img: "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80" },
      { key: "primer", title: "Grunt", img: "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80" },
      { key: "paint", title: "Bo‘yoq", img: IMG.paint },
    ],
  },

  {
    key: "engineering",
    title: "Kommunikatsiya",
    img: IMG.pipes,
    children: [
      {
        key: "plumbing",
        title: "Santexnika",
        img: IMG.pipes,
        children: [
          { key: "pipes", title: "Quvurlar", img: IMG.pipes },
          { key: "fittings", title: "Fitinglar", img: IMG.pipes },
          { key: "valves", title: "Kran va klapanlar", img: IMG.pipes },
          { key: "mixers", title: "Aralashtrgichlar", img: "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80" },
        ],
      },
      {
        key: "electric",
        title: "Elektr",
        img: IMG.electrical,
        children: [
          { key: "cables", title: "Kabellar", img: IMG.electrical },
          { key: "switches", title: "Kalit va rozetkalar", img: IMG.electrical },
          { key: "lights", title: "Yoritish", img: IMG.electrical },
        ],
      },
    ],
  },

  {
    key: "roofing",
    title: "Tom va izolyatsiya",
    img: IMG.roofing,
    children: [
      { key: "roof_sheet", title: "Profnastil / Tom list", img: IMG.roofing },
      { key: "insulation", title: "Izolyatsiya", img: "https://images.unsplash.com/photo-1581092334704-3bf26531a5c7?auto=format&fit=crop&w=1400&q=80" },
      { key: "waterproof", title: "Gidroizolyatsiya", img: "https://images.unsplash.com/photo-1501696461400-7c9f4b6c9a71?auto=format&fit=crop&w=1400&q=80" },
    ],
  },

  {
    key: "tools",
    title: "Asboblar",
    img: IMG.tools,
    children: [
      {
        key: "hand_tools_group",
        title: "Qo‘l asboblari",
        img: IMG.tools,
        children: [
          { key: "hand_tools", title: "Qo‘l asboblari (umumiy)", img: IMG.tools }, // leaf (DB bilan mos bo‘lsa)
          { key: "hammers", title: "Bolg‘a", img: IMG.tools },
          { key: "screwdrivers", title: "Otvertka", img: IMG.tools },
          { key: "pliers", title: "Qisqich", img: IMG.tools },
          { key: "measuring", title: "O‘lchov asboblari", img: IMG.tools },
        ],
      },
      {
        key: "power_tools_group",
        title: "Elektr asboblar",
        img: IMG.tools,
        children: [
          { key: "drills", title: "Drel / Perforator", img: IMG.tools },
          { key: "grinders", title: "Bolgarka", img: IMG.tools },
          { key: "saws", title: "Arralar", img: IMG.tools },
        ],
      },
      {
        key: "safety_group",
        title: "Himoya vositalari",
        img: IMG.safety,
        children: [
          { key: "gloves", title: "Qo‘lqop", img: IMG.safety },
          { key: "helmets", title: "Kaska", img: IMG.safety },
          { key: "glasses", title: "Ko‘zoynak", img: IMG.safety },
          { key: "masks", title: "Respirator", img: IMG.safety },
        ],
      },
    ],
  },
];
