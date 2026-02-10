/* =========================
IMOR Catalog Data (CATALOG_TREE)
- IMPORTANT: Leaf node key = catalogKey (backend category) bo‘lishi kerak!
- Qoida: katta kategoriya ustiga bossang → ichidagi birinchi LEAF (birinchi mahsulot turi) ga kirib ketsin.
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
  gravel:
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  drymix:
    "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80",
  electrical:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
  panel:
    "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&w=1400&q=80",
  switches:
    "https://images.unsplash.com/photo-1581092334704-3bf26531a5c7?auto=format&fit=crop&w=1400&q=80",
  lighting:
    "https://images.unsplash.com/photo-1540932239986-30128078f3c1?auto=format&fit=crop&w=1400&q=80",
  tools:
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1400&q=80",
  machinery:
    "https://images.unsplash.com/photo-1568819317551-31051b8a4e83?auto=format&fit=crop&w=1400&q=80",
  roofing:
    "https://images.unsplash.com/photo-1501696461400-7c9f4b6c9a71?auto=format&fit=crop&w=1400&q=80",
  insulation:
    "https://images.unsplash.com/photo-1605559424843-9d3d0e0d2f63?auto=format&fit=crop&w=1400&q=80",
  lumber:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
  paint:
    "https://images.unsplash.com/photo-1582582621959-48b03e4c7b17?auto=format&fit=crop&w=1400&q=80",
  tiles:
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1400&q=80",
  cable:
    "https://images.unsplash.com/photo-1581092919535-7146f1a590c2?auto=format&fit=crop&w=1400&q=80",
};

/**
 * ✅ Helper: node ichidagi ENG BIRINCHI leaf key ni topadi
 * (kategoriya ustiga bosilganda shunga navigate qilamiz)
 */
export function getFirstLeafKey(node) {
  if (!node) return null;
  if (!node.children?.length) return node.key; // leaf
  for (const ch of node.children) {
    const k = getFirstLeafKey(ch);
    if (k) return k;
  }
  return null;
}

export const CATALOG_TREE = [
  /* =======================
     1) Qurilish materiallari
  ======================= */
  {
    key: "materials",
    title: "Qurilish materiallari",
    img: IMG.blocks,
    children: [
      { key: "brick", title: "G‘isht", img: IMG.brick }, // leaf
      { key: "cement", title: "Sement", img: IMG.cement }, // leaf
      { key: "rebar", title: "Armatura", img: IMG.rebar }, // leaf
      { key: "blocks", title: "Gazablok / Penoblok", img: IMG.blocks }, // leaf
      { key: "gravel", title: "Shag‘al va qum", img: IMG.gravel }, // leaf
      { key: "concrete_mix", title: "Beton aralashmalar", img: IMG.drymix }, // leaf
      { key: "dry_mix", title: "Quruq aralashmalar", img: IMG.drymix }, // leaf
    ],
  },

  /* =======================
     2) Elektrika
  ======================= */
  {
    key: "electrics",
    title: "Elektrika",
    img: IMG.electrical,
    children: [
      { key: "automatic_breakers", title: "Avtomatlar (1P/2P/3P)", img: IMG.panel }, // leaf
      { key: "uzo_dif", title: "UZO / Difavtomat", img: IMG.panel }, // leaf
      { key: "electrical_panels", title: "Elektr shchitlar", img: IMG.panel }, // leaf
      { key: "sockets", title: "Rozetkalar", img: IMG.switches }, // leaf
      { key: "switches", title: "O‘chirgichlar", img: IMG.switches }, // leaf
      { key: "contactors_relays", title: "Rele va kontaktorlar", img: IMG.panel }, // leaf
      { key: "meters", title: "Hisoblagichlar", img: IMG.panel }, // leaf
      { key: "adapters_chargers", title: "Adapter / Zaryadlovchi", img: IMG.electrical }, // leaf
    ],
  },

  /* =======================
     3) Uskunalar
  ======================= */
  {
    key: "equipment",
    title: "Uskunalar",
    img: IMG.machinery,
    children: [
      { key: "concrete_mixer", title: "Beton aralashtirgich", img: IMG.machinery }, // leaf
      { key: "concrete_vibrator", title: "Beton vibratorlari", img: IMG.machinery }, // leaf
      { key: "compressors", title: "Kompressorlar", img: IMG.machinery }, // leaf
      { key: "generators", title: "Generatorlar", img: IMG.machinery }, // leaf
      { key: "pumps", title: "Nasoslar", img: IMG.machinery }, // leaf
      { key: "heaters", title: "Isitish uskunalari", img: IMG.machinery }, // leaf
      { key: "welding_machines", title: "Payvandlash apparatlari", img: IMG.machinery }, // leaf
    ],
  },

  /* =======================
     4) Tom va izolyatsiya
  ======================= */
  {
    key: "roofing",
    title: "Tom va izolyatsiya",
    img: IMG.roofing,
    children: [
      {
        key: "roof_materials_group",
        title: "Tom yopma materiallari",
        img: IMG.roofing,
        children: [
          { key: "roof_prof", title: "Profnastil", img: IMG.roofing }, // leaf
          { key: "roof_slate", title: "Shifer", img: IMG.roofing }, // leaf
          { key: "roof_bitumen", title: "Bitumli tom", img: IMG.roofing }, // leaf
          { key: "roof_tile_metal", title: "Metall cherepitsa", img: IMG.roofing }, // leaf
        ],
      },
      {
        key: "thermal_insulation_group",
        title: "Issiqlik izolyatsiyasi",
        img: IMG.insulation,
        children: [
          { key: "mineral_wool", title: "Mineral vata", img: IMG.insulation }, // leaf
          { key: "foam", title: "Penoplast", img: IMG.insulation }, // leaf
          { key: "xps", title: "Penopleks (XPS)", img: IMG.insulation }, // leaf
        ],
      },
      {
        key: "waterproofing_group",
        title: "Gidroizolyatsiya",
        img: IMG.roofing,
        children: [
          { key: "ruberoid", title: "Ruberoid", img: IMG.roofing }, // leaf
          { key: "membrane", title: "Membrana", img: IMG.roofing }, // leaf
          { key: "mastic", title: "Mastika", img: IMG.roofing }, // leaf
        ],
      },
      { key: "sound_insulation", title: "Shovqin izolyatsiyasi", img: IMG.insulation }, // leaf
    ],
  },

  /* =======================
     5) Yog‘och materiallar
  ======================= */
  {
    key: "wood",
    title: "Yog‘och materiallar",
    img: IMG.lumber,
    children: [
      { key: "boards", title: "Taxta (quruq/nam)", img: IMG.lumber }, // leaf
      { key: "plywood", title: "Fanera", img: IMG.lumber }, // leaf
      { key: "osb", title: "OSB", img: IMG.lumber }, // leaf
      { key: "dsp_mdf", title: "DSP / MDF", img: IMG.lumber }, // leaf
      { key: "timber", title: "Brus", img: IMG.lumber }, // leaf
      { key: "rails", title: "Reyka va lagalar", img: IMG.lumber }, // leaf
      { key: "laminate_base", title: "Laminat asoslari", img: IMG.lumber }, // leaf
      { key: "wood_antiseptic", title: "Antiseptik (himoya)", img: IMG.lumber }, // leaf
    ],
  },

  /* =======================
     6) Bo‘yoq va pardozlash
  ======================= */
  {
    key: "finishing",
    title: "Bo‘yoq va pardozlash",
    img: IMG.paint,
    children: [
      { key: "paint", title: "Bo‘yoqlar", img: IMG.paint }, // leaf
      { key: "varnish", title: "Laklar", img: IMG.paint }, // leaf
      { key: "putty", title: "Shpatlyovka", img: IMG.paint }, // leaf
      { key: "plaster", title: "Suvoq materiallari", img: IMG.paint }, // leaf
      { key: "decor_plaster", title: "Dekorativ suvoq", img: IMG.paint }, // leaf
      { key: "primer", title: "Gruntovka", img: IMG.paint }, // leaf
      { key: "wallpaper", title: "Oboy", img: IMG.paint }, // leaf
      { key: "tiles", title: "Keramika plitkalar", img: IMG.tiles }, // leaf
      { key: "mosaic", title: "Mozaika", img: IMG.tiles }, // leaf
    ],
  },

  /* =======================
     7) Elektr asboblari
  ======================= */
  {
    key: "power_tools",
    title: "Elektr asboblari",
    img: IMG.tools,
    children: [
      { key: "rotary_hammer", title: "Perforator", img: IMG.tools }, // leaf
      { key: "drill", title: "Drel", img: IMG.tools }, // leaf
      { key: "driver", title: "Shurupovyort", img: IMG.tools }, // leaf
      { key: "angle_grinder", title: "Bolgarka", img: IMG.tools }, // leaf
      { key: "jigsaw", title: "Elektr lobzik", img: IMG.tools }, // leaf
      { key: "router", title: "Frezer", img: IMG.tools }, // leaf
      { key: "wall_chaser", title: "Shtroborez", img: IMG.tools }, // leaf
      { key: "polisher", title: "Polirovka mashinasi", img: IMG.tools }, // leaf
    ],
  },

  /* =======================
     8) Yoritish
  ======================= */
  {
    key: "lighting",
    title: "Yoritish",
    img: IMG.lighting,
    children: [
      { key: "chandeliers", title: "Lyustralar", img: IMG.lighting }, // leaf
      { key: "led_panels", title: "LED panellar", img: IMG.lighting }, // leaf
      { key: "floodlights", title: "Proyektorlar", img: IMG.lighting }, // leaf
      { key: "spots", title: "Spot chiroqlar", img: IMG.lighting }, // leaf
      { key: "table_lamps", title: "Stol lampalari", img: IMG.lighting }, // leaf
      { key: "wall_lights", title: "Devorga chiroqlar", img: IMG.lighting }, // leaf
      { key: "smart_lights", title: "Aqlli yoritish", img: IMG.lighting }, // leaf
      { key: "street_poles", title: "Ko‘cha yoritish ustunlari", img: IMG.lighting }, // leaf
    ],
  },

  /* =======================
     9) Kabel va simlar
  ======================= */
  {
    key: "cables",
    title: "Kabel va simlar",
    img: IMG.cable,
    children: [
      {
        key: "electric_cables_group",
        title: "Elektr kabellari",
        img: IMG.cable,
        children: [
          { key: "cable_vvg", title: "VVG", img: IMG.cable }, // leaf
          { key: "cable_nym", title: "NYM", img: IMG.cable }, // leaf
          { key: "cable_pvs", title: "PVS", img: IMG.cable }, // leaf
        ],
      },
      {
        key: "internet_group",
        title: "Internet va aloqa",
        img: IMG.cable,
        children: [
          { key: "utp_ftp", title: "UTP / FTP", img: IMG.cable }, // leaf
          { key: "fiber", title: "Optik kabel", img: IMG.cable }, // leaf
        ],
      },
      {
        key: "special_group",
        title: "Maxsus kabellar",
        img: IMG.cable,
        children: [
          { key: "heat_resistant", title: "Issiqlikka chidamli", img: IMG.cable }, // leaf
          { key: "fire_resistant", title: "Yong‘inga qarshi", img: IMG.cable }, // leaf
        ],
      },
      { key: "cable_channels", title: "Kabel-kanallar", img: IMG.cable }, // leaf
      { key: "corrugated_pipe", title: "Gofra trubalar", img: IMG.cable }, // leaf
      { key: "ties_clips", title: "Xomut / Klips", img: IMG.cable }, // leaf
    ],
  },
];
