export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  strength: string;
  price: number;
  purity: string;
  molecularWeight?: string;
  casNumber?: string;
  molecularFormula?: string;
  sequence?: string;
  appearance: string;
  imageType: 'vial' | 'capsule' | 'water' | 'blend' | 'hgh' | 'liquid';
  image: string;
  description: string;
  inStock: boolean;
  isBlend: boolean;
  variants?: { strength: string; price: number }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'glp1',
    name: 'GLP-1 Research',
    slug: 'glp-1-research',
    description: 'Glucagon-like peptide-1 receptor agonists for metabolic and glucose homeostasis research. Includes Semaglutide, Tirzepatide, and novel triple-agonist compounds.',
    image: '/images/category-glp1.jpg',
    productCount: 27,
  },
  {
    id: 'growth',
    name: 'Growth Factors',
    slug: 'growth-factors',
    description: 'BPC-157, TB-500, GHK-Cu and other tissue repair and growth research peptides.',
    image: '/images/category-growth.jpg',
    productCount: 11,
  },
  {
    id: 'blends',
    name: 'Research Blends',
    slug: 'research-blends',
    description: 'Pre-formulated synergistic stacks combining complementary research compounds.',
    image: '/images/category-blends.jpg',
    productCount: 6,
  },
  {
    id: 'supplies',
    name: 'Lab Supplies',
    slug: 'lab-supplies',
    description: 'Bacteriostatic water, reconstitution kits, and essential laboratory supplies.',
    image: '/images/category-blends.jpg',
    productCount: 5,
  },
];

const imageMap: Record<string, string> = {
  vial: '/products/vial-semaglutide.jpg',
  capsule: '/products/bottle-capsules.jpg',
  water: '/products/vial-water.jpg',
  blend: '/products/vial-blend.jpg',
  hgh: '/products/vial-semaglutide.jpg',
  liquid: '/products/vial-water.jpg',
};

export const products: Product[] = [
  // GLP-1 / Incretin
  {
    id: 'semaglutide-5mg', name: 'Semaglutide', slug: 'semaglutide-5mg',
    category: 'glp-1-research', subcategory: 'GLP-1 Agonists',
    strength: '5mg', price: 89.00, purity: '99.5%',
    molecularWeight: '4113.64 g/mol', casNumber: '910463-68-2',
    molecularFormula: 'C187H291N45O59', sequence: 'His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys-Glu-Phe-Ile-Ala-Trp-Leu-Val-Arg-Gly-Arg-Gly',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'GLP-1 receptor agonist for metabolic research. Third-party HPLC-MS verified.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 89.00 },
      { strength: '10mg', price: 129.00 },
    ],
  },
  {
    id: 'tirzepatide-5mg', name: 'Tirzepatide', slug: 'tirzepatide-5mg',
    category: 'glp-1-research', subcategory: 'GLP-1 Agonists',
    strength: '5mg', price: 49.00, purity: '99.2%',
    molecularWeight: '4813.45 g/mol', casNumber: '2023788-19-2',
    molecularFormula: 'C225H348N48O68', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Dual GIP/GLP-1 receptor agonist for metabolic pathway research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 49.00 },
      { strength: '10mg', price: 89.00 },
      { strength: '20mg', price: 179.00 },
      { strength: '50mg', price: 429.00 },
    ],
  },
  {
    id: 'retatrutide-5mg', name: 'Retatrutide', slug: 'retatrutide-5mg',
    category: 'glp-1-research', subcategory: 'GLP-1 Agonists',
    strength: '5mg', price: 109.00, purity: '99.3%',
    molecularWeight: '5135.80 g/mol', casNumber: '2381089-83-2',
    molecularFormula: 'C243H366N62O72', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Triple GIP/GLP-1/Glucagon receptor agonist for advanced metabolic research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 109.00 },
      { strength: '10mg', price: 129.00 },
      { strength: '20mg', price: 209.00 },
      { strength: '50mg', price: 469.00 },
      { strength: '100mg', price: 929.00 },
    ],
  },
  {
    id: 'cagrilintide-5mg', name: 'Cagrilintide', slug: 'cagrilintide-5mg',
    category: 'glp-1-research', subcategory: 'GLP-1 Agonists',
    strength: '5mg', price: 79.00, purity: '99.1%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Amylin analogue for satiety signaling and metabolic research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 79.00 },
      { strength: '10mg', price: 149.00 },
    ],
  },
  {
    id: 'sermorelin-5mg', name: 'Sermorelin', slug: 'sermorelin-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 59.00, purity: '99.4%',
    molecularWeight: '3357.93 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'GHRH analogue for growth hormone secretion research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 59.00 },
      { strength: '10mg', price: 109.00 },
    ],
  },
  {
    id: 'tesamorelin-5mg', name: 'Tesamorelin', slug: 'tesamorelin-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 49.00, purity: '99.3%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'GHRH analogue for growth hormone axis research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 49.00 },
      { strength: '10mg', price: 79.00 },
      { strength: '20mg', price: 119.00 },
    ],
  },
  {
    id: 'cjc1295-dac-5mg', name: 'CJC-1295 with DAC', slug: 'cjc1295-dac-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 139.00, purity: '99.5%',
    molecularWeight: '3647.28 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Long-acting GHRH analogue with DAC for extended half-life research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 139.00 },
      { strength: '10mg', price: 279.00 },
    ],
  },
  {
    id: 'cjc1295-nodac-5mg', name: 'CJC-1295 without DAC', slug: 'cjc1295-nodac-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 49.00, purity: '99.4%',
    molecularWeight: '3367.90 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Modified GRF(1-29) for growth hormone pulse research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 49.00 },
      { strength: '10mg', price: 79.00 },
    ],
  },
  {
    id: 'ipamorelin-5mg', name: 'Ipamorelin', slug: 'ipamorelin-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 39.00, purity: '99.2%',
    molecularWeight: '711.85 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Selective GH secretagogue for growth hormone research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 39.00 },
      { strength: '10mg', price: 59.00 },
    ],
  },
  {
    id: '5amino1mq-5mg', name: '5-Amino-1MQ', slug: '5amino1mq-5mg',
    category: 'glp-1-research', subcategory: 'Metabolic Research',
    strength: '5mg', price: 29.00, purity: '99.0%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'NNMT inhibitor for metabolic pathway research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 29.00 },
      { strength: '10mg', price: 49.00 },
    ],
  },
  {
    id: 'aod9604-5mg', name: 'AOD-9604', slug: 'aod9604-5mg',
    category: 'glp-1-research', subcategory: 'Metabolic Research',
    strength: '5mg', price: 55.00, purity: '99.3%',
    molecularWeight: '1815.08 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'HGH fragment 176-191 for lipolysis mechanism research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 55.00 },
      { strength: '10mg', price: 95.00 },
    ],
  },
  {
    id: 'mazdutide-5mg', name: 'Mazdutide', slug: 'mazdutide-5mg',
    category: 'glp-1-research', subcategory: 'GLP-1 Agonists',
    strength: '5mg', price: 79.00, purity: '99.1%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Dual GLP-1/GCGR agonist for metabolic research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 79.00 },
      { strength: '10mg', price: 119.00 },
    ],
  },
  // Growth Factors
  {
    id: 'bpc157-5mg', name: 'BPC-157', slug: 'bpc157-5mg',
    category: 'growth-factors', subcategory: 'Tissue Repair',
    strength: '5mg', price: 39.00, purity: '99.6%',
    molecularWeight: '1419.54 g/mol', casNumber: '137525-51-0',
    molecularFormula: 'C62H98N16O22', sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Leu',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: '/products/vial-bpc157.jpg', description: 'Pentadecapeptide for tissue regeneration and angiogenesis research. HPLC-MS verified.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 39.00 },
      { strength: '10mg', price: 69.00 },
    ],
  },
  {
    id: 'tb500-5mg', name: 'TB-500', slug: 'tb500-5mg',
    category: 'growth-factors', subcategory: 'Tissue Repair',
    strength: '5mg', price: 49.00, purity: '99.4%',
    molecularWeight: '4963.44 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Thymosin Beta-4 fragment for cytoskeleton and wound healing research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 49.00 },
      { strength: '10mg', price: 79.00 },
    ],
  },
  {
    id: 'ghk-cu-50mg', name: 'GHK-Cu', slug: 'ghk-cu-50mg',
    category: 'growth-factors', subcategory: 'Copper Peptides',
    strength: '50mg', price: 49.00, purity: '99.5%',
    molecularWeight: '340.38 g/mol', appearance: 'Blue lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Copper peptide for tissue remodeling and gene expression research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '50mg', price: 49.00 },
      { strength: '100mg', price: 59.00 },
    ],
  },
  {
    id: 'bpc157-tb500-blend', name: 'BPC-157 + TB-500 Blend', slug: 'bpc157-tb500-blend',
    category: 'research-blends', subcategory: 'Synergistic Stacks',
    strength: '10mg', price: 109.00, purity: '99.4%',
    appearance: 'White lyophilized powder', imageType: 'blend',
    image: imageMap.blend, description: '5mg BPC-157 + 5mg TB-500. Synergistic tissue repair research blend.',
    inStock: true, isBlend: true,
    variants: [
      { strength: '10mg', price: 109.00 },
      { strength: '20mg', price: 149.00 },
    ],
  },
  {
    id: 'cjc-ipamorelin-blend', name: 'CJC-1295 + Ipamorelin Blend', slug: 'cjc-ipamorelin-blend',
    category: 'research-blends', subcategory: 'Synergistic Stacks',
    strength: '10mg', price: 79.00, purity: '99.3%',
    appearance: 'White lyophilized powder', imageType: 'blend',
    image: imageMap.blend, description: '5mg CJC-1295 (no DAC) + 5mg Ipamorelin. GH axis synergistic blend.',
    inStock: true, isBlend: true,
  },
  // Lab Supplies
  {
    id: 'bac-water-3ml', name: 'Bacteriostatic Water', slug: 'bac-water-3ml',
    category: 'lab-supplies', subcategory: 'Reconstitution',
    strength: '3ml', price: 8.99, purity: 'Sterile',
    appearance: 'Clear sterile solution', imageType: 'water',
    image: imageMap.water, description: 'Sterile water with 0.9% benzyl alcohol for reconstitution.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '3ml', price: 8.99 },
      { strength: '10ml', price: 10.99 },
    ],
  },
  {
    id: 'acetic-acid-3ml', name: 'Acetic Acid Water', slug: 'acetic-acid-3ml',
    category: 'lab-supplies', subcategory: 'Reconstitution',
    strength: '3ml', price: 10.99, purity: 'Sterile',
    appearance: 'Clear sterile solution', imageType: 'water',
    image: imageMap.water, description: 'Sterile acetic acid solution for pH-sensitive peptide reconstitution.',
    inStock: true, isBlend: false,
  },
  // Additional bestsellers
  {
    id: 'mk677-5mg', name: 'MK-677 (Ibutamoren)', slug: 'mk677-5mg',
    category: 'glp-1-research', subcategory: 'Growth Secretagogues',
    strength: '5mg', price: 55.00, purity: '99.2%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Oral GH secretagogue for growth hormone axis research.',
    inStock: true, isBlend: false,
  },
  {
    id: 'melanotan2-10mg', name: 'Melanotan II', slug: 'melanotan2-10mg',
    category: 'growth-factors', subcategory: 'Melanocortin',
    strength: '10mg', price: 35.00, purity: '99.1%',
    molecularWeight: '1024.18 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Synthetic melanocortin peptide for melanogenesis research.',
    inStock: true, isBlend: false,
  },
  {
    id: 'ghk-cu-100mg', name: 'GHK-Cu', slug: 'ghk-cu-100mg',
    category: 'growth-factors', subcategory: 'Copper Peptides',
    strength: '100mg', price: 59.00, purity: '99.5%',
    molecularWeight: '340.38 g/mol', appearance: 'Blue lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Copper tripeptide for tissue repair and remodeling research.',
    inStock: true, isBlend: false,
  },
  {
    id: 'hgh-10iu', name: 'HGH 191aa', slug: 'hgh-10iu',
    category: 'glp-1-research', subcategory: 'Growth Hormone',
    strength: '10 IU', price: 49.00, purity: '99.0%',
    appearance: 'White lyophilized powder', imageType: 'hgh',
    image: imageMap.vial, description: 'Recombinant human growth hormone (somatropin) for research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '10 IU', price: 49.00 },
      { strength: '12 IU', price: 55.00 },
      { strength: '15 IU', price: 59.00 },
      { strength: '24 IU', price: 79.00 },
      { strength: '36 IU', price: 85.00 },
    ],
  },
  {
    id: 'nad-plus-100mg', name: 'NAD+', slug: 'nad-plus-100mg',
    category: 'growth-factors', subcategory: 'Cellular Health',
    strength: '100mg', price: 40.00, purity: '99.3%',
    molecularWeight: '663.43 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Nicotinamide adenine dinucleotide for cellular metabolism research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '100mg', price: 40.00 },
      { strength: '500mg', price: 75.00 },
      { strength: '1000mg', price: 150.00 },
    ],
  },
  {
    id: 'glutathione-600mg', name: 'Glutathione', slug: 'glutathione-600mg',
    category: 'glp-1-research', subcategory: 'Antioxidants',
    strength: '600mg', price: 59.00, purity: '99.4%',
    appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Tripeptide antioxidant for oxidative stress research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '600mg', price: 59.00 },
      { strength: '1500mg', price: 99.00 },
    ],
  },
  {
    id: 'll37-5mg', name: 'LL-37', slug: 'll37-5mg',
    category: 'growth-factors', subcategory: 'Antimicrobial',
    strength: '5mg', price: 69.00, purity: '99.5%',
    molecularWeight: '4492.60 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Cathelicidin-derived antimicrobial peptide for innate immunity research.',
    inStock: true, isBlend: false,
  },
  {
    id: 'epithalon-10mg', name: 'Epithalon', slug: 'epithalon-10mg',
    category: 'glp-1-research', subcategory: 'Telomere Research',
    strength: '10mg', price: 45.00, purity: '99.3%',
    molecularWeight: '390.35 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Telomerase activator peptide for cellular aging research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '10mg', price: 45.00 },
      { strength: '20mg', price: 70.00 },
      { strength: '50mg', price: 120.00 },
    ],
  },
  {
    id: 'dsip-5mg', name: 'DSIP', slug: 'dsip-5mg',
    category: 'glp-1-research', subcategory: 'Neuropeptides',
    strength: '5mg', price: 30.00, purity: '99.2%',
    molecularWeight: '848.81 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Delta sleep-inducing peptide for sleep architecture research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 30.00 },
      { strength: '10mg', price: 45.00 },
      { strength: '15mg', price: 55.00 },
    ],
  },
  {
    id: 'selank-5mg', name: 'Selank', slug: 'selank-5mg',
    category: 'glp-1-research', subcategory: 'Neuropeptides',
    strength: '5mg', price: 35.00, purity: '99.4%',
    molecularWeight: '751.89 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'Synthetic tuftsin analogue for cognitive research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 35.00 },
      { strength: '10mg', price: 50.00 },
    ],
  },
  {
    id: 'semax-5mg', name: 'Semax', slug: 'semax-5mg',
    category: 'glp-1-research', subcategory: 'Neuropeptides',
    strength: '5mg', price: 35.00, purity: '99.3%',
    molecularWeight: '813.97 g/mol', appearance: 'White lyophilized powder', imageType: 'vial',
    image: imageMap.vial, description: 'ACTH-derived peptide for neuroplasticity research.',
    inStock: true, isBlend: false,
    variants: [
      { strength: '5mg', price: 35.00 },
      { strength: '10mg', price: 55.00 },
    ],
  },
  {
    id: 'bpc157-caps', name: 'BPC-157 (Capsules)', slug: 'bpc157-caps',
    category: 'growth-factors', subcategory: 'Tissue Repair',
    strength: '100 count (500mcg)', price: 85.00, purity: '99.2%',
    appearance: 'White capsules in HDPE bottle', imageType: 'capsule',
    image: imageMap.capsule, description: 'BPC-157 500mcg capsules for oral bioavailability research.',
    inStock: true, isBlend: false,
  },
  {
    id: 'pinealon-caps', name: 'Pinealon (Capsules)', slug: 'pinealon-caps',
    category: 'glp-1-research', subcategory: 'Neuropeptides',
    strength: '100 count', price: 99.00, purity: '99.0%',
    appearance: 'White capsules in HDPE bottle', imageType: 'capsule',
    image: imageMap.capsule, description: 'Short peptide bioregulator for cellular signaling research.',
    inStock: true, isBlend: false,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Peptide Purity: HPLC-MS Analysis Methods',
    slug: 'understanding-peptide-purity-hplc-ms',
    excerpt: 'A comprehensive guide to analytical methods used for peptide purity verification in research settings.',
    category: 'Protocols',
    date: '2025-05-15',
    readTime: '8 min read',
    image: '/images/blog-hero.jpg',
  },
  {
    id: '2',
    title: 'GLP-1 Receptor Agonists: Mechanisms and Research Applications',
    slug: 'glp-1-receptor-agonists-research',
    excerpt: 'Exploring the pharmacological mechanisms of GLP-1 compounds in metabolic research contexts.',
    category: 'Analytical',
    date: '2025-04-28',
    readTime: '12 min read',
    image: '/images/category-glp1.jpg',
  },
  {
    id: '3',
    title: 'Cold-Chain Shipping: Maintaining Peptide Integrity',
    slug: 'cold-chain-shipping-peptide-integrity',
    excerpt: 'Best practices for thermal management during peptide transport and storage.',
    category: 'Protocols',
    date: '2025-04-10',
    readTime: '6 min read',
    image: '/images/category-growth.jpg',
  },
  {
    id: '4',
    title: 'Research-Use-Only Compliance: A Global Overview',
    slug: 'ruo-compliance-global-overview',
    excerpt: 'Navigating international regulations for research chemical procurement and handling.',
    category: 'Compliance',
    date: '2025-03-22',
    readTime: '10 min read',
    image: '/images/category-blends.jpg',
  },
  {
    id: '5',
    title: 'Peptide Reconstitution: pH and Solvent Selection',
    slug: 'peptide-reconstitution-ph-solvent',
    excerpt: 'Technical considerations for optimal peptide solubility and stability in laboratory settings.',
    category: 'Protocols',
    date: '2025-03-05',
    readTime: '7 min read',
    image: '/images/blog-hero.jpg',
  },
  {
    id: '6',
    title: 'The Science of Copper Peptides in Tissue Research',
    slug: 'copper-peptides-tissue-research',
    excerpt: 'Examining GHK-Cu and related compounds in wound healing and tissue remodeling studies.',
    category: 'Analytical',
    date: '2025-02-18',
    readTime: '9 min read',
    image: '/images/category-growth.jpg',
  },
];

export const reviews = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    institution: 'Stanford Research Lab',
    rating: 5,
    text: 'The purity consistency from Auratech has been exceptional for our longitudinal studies. Every batch comes with comprehensive COA documentation.',
  },
  {
    id: '2',
    name: 'Dr. Michael Torres',
    institution: 'MIT Bioengineering',
    rating: 5,
    text: 'We\'ve been sourcing research peptides here for over two years. The cold-chain shipping is reliable and the customer support understands scientific requirements.',
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    institution: 'Oxford Molecular Sciences',
    rating: 5,
    text: 'HPLC-MS verification on every compound gives us confidence in our research data. Highly recommended for serious research institutions.',
  },
];

export const faqs = [
  {
    question: 'What does "Research Use Only" mean?',
    answer: 'Research Use Only (RUO) designates that these compounds are intended strictly for laboratory research purposes. They are not approved for human consumption, diagnostic use, or therapeutic applications. All customers must confirm they are qualified research professionals before purchase.',
  },
  {
    question: 'How do you verify peptide purity?',
    answer: 'Every batch is analyzed by independent third-party laboratories using HPLC (High Performance Liquid Chromatography) and MS (Mass Spectrometry). Certificates of Analysis (COA) are available for all products, detailing purity percentage, molecular weight confirmation, and chromatographic data.',
  },
  {
    question: 'What shipping methods do you use?',
    answer: 'We ship globally using temperature-controlled packaging with cold packs for lyophilized peptides. Domestic orders typically arrive within 2-3 business days. International shipping times vary by destination, usually 5-10 business days. All packages are discreet and unmarked.',
  },
  {
    question: 'How should peptides be stored?',
    answer: 'Lyophilized peptides should be stored at -20°C for long-term stability. Once reconstituted, store at 4°C and use within the timeframe specified in the product documentation. Avoid repeated freeze-thaw cycles. Always handle under sterile conditions.',
  },
];
