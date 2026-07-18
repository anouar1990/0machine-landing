"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Loader
    "loader.loading": "Loading experience...",
    // Navbar
    "nav.features": "Features",
    "nav.benefits": "Benefits",
    "nav.workflow": "How It Works",
    "nav.pricing": "Pricing",
    "nav.signin": "Sign In",
    "nav.trial": "Start Free Trial",
    
    // Hero
    "hero.badge": "Built for Laser & CNC Makers",
    "hero.title1": "Run Your Laser",
    "hero.title2": "Business ",
    "hero.titleAccent": "Smarter.",
    "hero.subtitle": "Track materials, calculate costs, manage clients, and generate quotes — all from one beautiful app designed for laser cutters and CNC makers.",
    "hero.ctaTrial": "⚡ Start Free Trial",
    "hero.ctaFeatures": "See Features →",
    "hero.trialNote": "3 days free · then $9/mo · cancel anytime",
    
    // Benefits
    "benefits.badge": "Real Benefits",
    "benefits.title": "Every Feature Saves You",
    "benefits.titleAccent": "Time and Money",
    "benefits.subtitle": "Here is how 0Machine helps you stop wasting hours on admin work and start making more profit.",
    
    "benefits.calc.feature": "Cost Calculator",
    "benefits.calc.title": "Know your true cost per job — instantly",
    "benefits.calc.desc": "Input materials, laser time, electricity, labor, and machine wear. Get a real-time cost breakdown with recommended selling price. Never underprice a job again.",
    "benefits.calc.outcome": "Stop losing money on jobs you thought were profitable",
    "benefits.calc.stat": "3x",
    "benefits.calc.statLabel": "faster quoting",
    
    "benefits.inv.feature": "Material Inventory",
    "benefits.inv.title": "Track every sheet, every cut, every dollar",
    "benefits.inv.desc": "Manage your plywood, acrylic, MDF, and leather stock with real-time inventory value. Get low-stock alerts before you run out mid-project.",
    "benefits.inv.outcome": "Eliminate surprise material shortages during production",
    "benefits.inv.stat": "0",
    "benefits.inv.statLabel": "stockouts",
    
    "benefits.order.feature": "Order Management",
    "benefits.order.title": "Every order tracked from request to delivery",
    "benefits.order.desc": "See all orders at a glance — Pending, In Progress, Completed. Track client names, due dates, revenue earned, and pending payments in one view.",
    "benefits.order.outcome": "Never miss a deadline or forget a client order",
    "benefits.order.stat": "100%",
    "benefits.order.statLabel": "order visibility",
    
    "benefits.presets.feature": "Laser Presets",
    "benefits.presets.title": "Perfect settings every time, zero guesswork",
    "benefits.presets.desc": "Save speed, power, frequency, passes, and air assist settings per material. Load presets instantly when switching between plywood, acrylic, or leather.",
    "benefits.presets.outcome": "Reduce wasted material from wrong machine settings",
    "benefits.presets.stat": "10s",
    "benefits.presets.statLabel": "to load settings",
    
    "benefits.quote.feature": "Quote Generator",
    "benefits.quote.title": "Send professional quotes in under a minute",
    "benefits.quote.desc": "Create detailed quotes with line items, VAT, and totals. Look professional and close deals faster with client-ready documents.",
    "benefits.quote.outcome": "Win more clients with polished, instant quotes",
    "benefits.quote.stat": "60s",
    "benefits.quote.statLabel": "to send a quote",
    
    "benefits.nest.feature": "Nesting Estimator",
    "benefits.nest.title": "Maximize every sheet, minimize every waste",
    "benefits.nest.desc": "Calculate how many parts fit on a sheet before you cut. Optimize material usage and reduce scrap across every job.",
    "benefits.nest.outcome": "Save up to 30% on material costs with smarter nesting",
    "benefits.nest.stat": "30%",
    "benefits.nest.statLabel": "less waste",

    // Feature Showcase
    "features.badge": "Features",
    "features.title": "Designed for the way you work",
    "features.subtitle": "Explore the core tools that make running a workshop effortless.",
    
    "features.tab.dashboard": "Dashboard",
    "features.tab.calc": "Cost Calculator",
    "features.tab.inventory": "Inventory",
    "features.tab.orders": "Order Tracker",
    "features.tab.presets": "Laser Presets",
    
    "features.db.title": "Your entire workshop, one glance",
    "features.db.subtitle": "See total projects, active jobs, completed work, and revenue at a glance. No more guessing where things stand.",
    "features.db.h1": "Real-time project stats",
    "features.db.h2": "Revenue tracking",
    "features.db.h3": "Recent projects feed",
    "features.db.h4": "Status overview",
    
    "features.calc.title": "Real-time cost & profit calculation",
    "features.calc.subtitle": "Input material cost, sheet dimensions, laser time, electricity, machine wear, and labor. See your cost breakdown and recommended selling price instantly.",
    "features.calc.h1": "Material cost per unit",
    "features.calc.h2": "Machine & energy tracking",
    "features.calc.h3": "Profit margin calculator",
    "features.calc.h4": "Recommended pricing",
    
    "features.inv.title": "Live inventory valuation & alerts",
    "features.inv.subtitle": "Track wood, acrylic, and custom materials by the sheet or scrap size. Get automatic notifications when a material drops below your safety threshold.",
    "features.inv.h1": "Plywood & Acrylic logs",
    "features.inv.h2": "Low-stock notifications",
    "features.inv.h3": "Automatic usage deductions",
    "features.inv.h4": "Cost tracking per material",
    
    "features.orders.title": "Visual production pipeline",
    "features.orders.subtitle": "Track status from quote request to final delivery. Set deadlines, record payments, and upload project images for quick visual recall.",
    "features.orders.h1": "Drag & drop status board",
    "features.orders.h2": "Client relationship tracker",
    "features.orders.h3": "Revenue and balance logs",
    "features.orders.h4": "Due date calendars",
    
    "features.presets.title": "Your workshop settings library",
    "features.presets.subtitle": "Never waste material testing cuts again. Save speed, power, frequency, passes, and air settings for different lasers and tube powers.",
    "features.presets.h1": "Multi-machine support",
    "features.presets.h2": "Material thickness tabs",
    "features.presets.h3": "Vector vs. Engrave modes",
    "features.presets.h4": "Instant settings lookup",

    // Interactive Mockup Texts
    "mock.total": "Total",
    "mock.inprogress": "In Progress",
    "mock.completed": "Completed",
    "mock.revenue": "Revenue",
    "mock.recent": "RECENT PROJECTS",
    "mock.coasters": "Custom Coasters",
    "mock.birch": "Birch Plywood 3mm",
    "mock.sheet": "Sheet Cost",
    "mock.usage": "Usage",
    "mock.laser": "Laser Time",
    "mock.labor": "Labor",
    "mock.cost": "Total Cost",
    "mock.price": "Rec. Price",
    "mock.wood": "Wood - Birch 3mm",
    "mock.acrylic": "Acrylic - Red 3mm",
    "mock.sheets": "sheets",
    "mock.stock": "In Stock",
    "mock.pending": "Pending",
    "mock.deliv": "Delivered",
    "mock.bal": "Bal. Due",
    "mock.speed": "Speed",
    "mock.power": "Power",
    
    // Comparison
    "comp.badge": "Comparison",
    "comp.title": "Spreadsheets vs",
    "comp.titleAccent": "0Machine",
    "comp.subtitle": "Why makers are ditching Excel for a dedicated planner.",
    "comp.col.old": "Traditional Ways",
    "comp.col.new": "The 0Machine Way",
    "comp.old.1": "Pricing calculated from gut feeling — losing money on every other job",
    "comp.old.2": "Design files scattered across USB drives, desktop folders, and messaging apps",
    "comp.old.3": "Revenue tracked in messy spreadsheets — no idea which projects are profitable",
    "comp.old.4": "Laser settings written on sticky notes — wrong power, wasted material",
    "comp.old.5": "Orders managed in your head — missed deadlines and forgotten clients",
    "comp.old.6": "Material shortages discovered mid-job — production halted, clients waiting",
    "comp.new.1": "Cost Calculator shows real production cost and recommended selling price instantly",
    "comp.new.2": "Every project organized with photos, costs, time, materials, and client info",
    "comp.new.3": "Smart analytics show revenue, top projects, completion rates, and trends",
    "comp.new.4": "Laser Presets loaded in 10 seconds — perfect settings every time",
    "comp.new.5": "Orders tracked from Pending to Completed with due dates and client names",
    "comp.new.6": "Material Inventory shows stock levels and total value — never run out",
    
    // Workflow
    "flow.badge": "How It Works",
    "flow.title": "From Setup to Delivery in",
    "flow.titleAccent": "4 Steps",
    "flow.step1.title": "Upload & Organize",
    "flow.step1.desc": "Add your project with materials, photos, and client details. Use templates to start recurring jobs in seconds.",
    "flow.step2.title": "Calculate & Quote",
    "flow.step2.desc": "Use the Cost Calculator to get your true cost — material, machine time, labor, electricity. Generate a professional quote instantly.",
    "flow.step3.title": "Produce & Track",
    "flow.step3.desc": "Load your Laser Presets, start the built-in timer, and track progress. Move orders from Pending to In Progress automatically.",
    "flow.step4.title": "Deliver & Grow",
    "flow.step4.desc": "Export PDF reports for clients, review your analytics, and see which projects drive the most revenue. Grow with data, not guesswork.",

    // Product Showcase
    "showcase.badge": "Product Showcase",
    "showcase.title": "Built for your browser and mobile",
    "showcase.subtitle": "Access your dashboard from your workshop tablet or phone.",
    
    // Social Proof
    "social.badge": "Testimonials",
    "social.title": "Loved by CNC & Laser Makers",
    "social.subtitle": "Here is what workshop owners are saying about 0Machine Planner.",
    "social.role.laser": "Laser Workshop Owner",
    "social.role.cnc": "CNC Craftsman",
    "social.role.engrave": "Custom Engraver",
    
    // Pricing
    "price.badge": "Simple Pricing",
    "price.title": "One Plan. Everything",
    "price.titleAccent": "Included.",
    "price.subtitle": "Start free, upgrade when you're ready. No hidden fees, no feature gates per tier.",
    "price.trial.name": "Free Trial",
    "price.trial.price": "$0",
    "price.trial.period": "for 3 days",
    "price.trial.desc": "Try every feature risk-free. No credit card required to start.",
    "price.trial.f1": "Unlimited projects",
    "price.trial.f2": "Cost Calculator",
    "price.trial.f3": "Material inventory",
    "price.trial.f4": "Order management",
    "price.trial.f5": "Laser Presets",
    "price.trial.f6": "Basic analytics",
    "price.trial.cta": "Start Free Trial",
    "price.pro.name": "Pro",
    "price.pro.price": "$9",
    "price.pro.period": "/month",
    "price.pro.desc": "Everything you need to run a profitable laser workshop.",
    "price.pro.f.title": "Everything in Free, plus:",
    "price.pro.f1": "PDF report export",
    "price.pro.f2": "Advanced analytics & stats",
    "price.pro.f3": "Client manager",
    "price.pro.f4": "Project photos",
    "price.pro.f5": "Project templates",
    "price.pro.f6": "Machine profiles",
    "price.pro.f7": "Quote generator",
    "price.pro.f8": "Nesting estimator",
    "price.pro.f9": "Priority support",
    "price.pro.cta": "Get Pro Access",
    "price.popular": "Most Popular",
    
    // Final CTA
    "final.title": "Stop Managing Your",
    "final.titleMid": "Workshop in",
    "final.titleAccent": "Spreadsheets.",
    "final.subtitle": "Join hundreds of laser and CNC makers who switched to 0Machine and finally know their real costs, track every job, and grow their business with confidence.",
    "final.cta.trial": "⚡ Start Your Free Trial",
    "final.cta.features": "Explore Features",
    "final.terms": "3 days free · $9/mo after · Cancel anytime · No credit card required",
    
    // Footer
    "foot.desc": "The all-in-one planner for laser cutters and CNC makers. Track everything. Grow your business.",
    "foot.hours": "Mon - Fri: 9am - 5pm MST",
    "foot.payments": "Secure payments via Stripe",
    "foot.billed": "Billed monthly",
    "foot.cancel": "Cancel anytime",
    "foot.copyright": "© 2026 0Machine Planner. Built for makers. ⚡"
  },
  fr: {
    // Loader
    "loader.loading": "Chargement de l'expérience...",
    // Navbar
    "nav.features": "Fonctionnalités",
    "nav.benefits": "Avantages",
    "nav.workflow": "Fonctionnement",
    "nav.pricing": "Tarifs",
    "nav.signin": "Connexion",
    "nav.trial": "Essai Gratuit",
    
    // Hero
    "hero.badge": "Conçu pour les créateurs Laser & CNC",
    "hero.title1": "Gérez votre activité",
    "hero.title2": "laser ",
    "hero.titleAccent": "plus intelligemment.",
    "hero.subtitle": "Suivez les matériaux, calculez les coûts, gérez les clients et générez des devis — le tout depuis une magnifique application conçue pour les découpeurs laser et créateurs CNC.",
    "hero.ctaTrial": "⚡ Essai Gratuit",
    "hero.ctaFeatures": "Fonctionnalités →",
    "hero.trialNote": "3 jours gratuits · puis 9 $/mois · annulez à tout moment",
    
    // Benefits
    "benefits.badge": "Avantages Réels",
    "benefits.title": "Chaque fonctionnalité vous fait économiser",
    "benefits.titleAccent": "Temps et Argent",
    "benefits.subtitle": "Voici comment 0Machine vous aide à arrêter de perdre des heures en paperasse pour vous concentrer sur vos bénéfices.",
    
    "benefits.calc.feature": "Calculateur de Coûts",
    "benefits.calc.title": "Déterminez votre coût réel par travail — instantanément",
    "benefits.calc.desc": "Saisissez les matériaux, le temps laser, l'électricité, la main-d'œuvre et l'usure de la machine. Obtenez une ventilation des coûts en temps réel avec un prix de vente recommandé. Ne sous-estimez plus jamais un travail.",
    "benefits.calc.outcome": "Arrêtez de perdre de l'argent sur des travaux que vous pensiez rentables",
    "benefits.calc.stat": "3x",
    "benefits.calc.statLabel": "devis plus rapides",
    
    "benefits.inv.feature": "Inventaire des Matériaux",
    "benefits.inv.title": "Suivez chaque feuille, chaque découpe, chaque centime",
    "benefits.inv.desc": "Gérez votre stock de contreplaqué, acrylique, MDF et cuir avec la valeur de l'inventaire en temps réel. Recevez des alertes de stock bas avant de tomber en panne en plein projet.",
    "benefits.inv.outcome": "Éliminez les pénuries surprises de matériaux pendant la production",
    "benefits.inv.stat": "0",
    "benefits.inv.statLabel": "ruptures de stock",
    
    "benefits.order.feature": "Gestion des Commandes",
    "benefits.order.title": "Chaque commande est suivie de la demande à la livraison",
    "benefits.order.desc": "Visualisez toutes les commandes en un coup d'œil — En attente, En cours, Terminées. Suivez les noms des clients, les dates d'échéance, les revenus gagnés et les paiements en attente.",
    "benefits.order.outcome": "Ne manquez jamais une date limite et n'oubliez jamais une commande client",
    "benefits.order.stat": "100%",
    "benefits.order.statLabel": "visibilité des commandes",
    
    "benefits.presets.feature": "Préréglages Laser",
    "benefits.presets.title": "Des réglages parfaits à chaque fois, sans devinettes",
    "benefits.presets.desc": "Enregistrez la vitesse, la puissance, la fréquence, les passes et les paramètres d'assistance d'air par matériau. Chargez instantanément les préréglages lors du passage d'un matériau à un autre.",
    "benefits.presets.outcome": "Réduisez le gaspillage de matériaux dû à de mauvais réglages de la machine",
    "benefits.presets.stat": "10s",
    "benefits.presets.statLabel": "pour charger",
    
    "benefits.quote.feature": "Générateur de Devis",
    "benefits.quote.title": "Envoyez des devis professionnels en moins d'une minute",
    "benefits.quote.desc": "Créez des devis détaillés avec des articles individuels, la TVA et les totaux. Soyez professionnel et concluez vos ventes plus rapidement avec des documents prêts pour vos clients.",
    "benefits.quote.outcome": "Gagnez plus de clients avec des devis soignés et instantanés",
    "benefits.quote.stat": "60s",
    "benefits.quote.statLabel": "pour envoyer",
    
    "benefits.nest.feature": "Estimateur d'Imbrication",
    "benefits.nest.title": "Maximisez chaque feuille, minimisez le gaspillage",
    "benefits.nest.desc": "Calculez le nombre de pièces qui rentrent sur une feuille avant de couper. Optimisez l'utilisation des matériaux et réduisez les chutes sur chaque travail.",
    "benefits.nest.outcome": "Économisez jusqu'à 30 % sur les coûts de matériaux grâce à une imbrication intelligente",
    "benefits.nest.stat": "30%",
    "benefits.nest.statLabel": "de déchets en moins",

    // Feature Showcase
    "features.badge": "Fonctionnalités",
    "features.title": "Conçu pour votre façon de travailler",
    "features.subtitle": "Explorez les outils clés qui facilitent la gestion de votre atelier au quotidien.",
    
    "features.tab.dashboard": "Tableau de Bord",
    "features.tab.calc": "Calculateur",
    "features.tab.inventory": "Inventaire",
    "features.tab.orders": "Commandes",
    "features.tab.presets": "Préréglages",
    
    "features.db.title": "Tout votre atelier en un coup d'œil",
    "features.db.subtitle": "Consultez le nombre total de projets, les tâches actives, le travail terminé et les revenus générés d'un seul coup d'œil. Plus besoin de deviner.",
    "features.db.h1": "Statistiques en temps réel",
    "features.db.h2": "Suivi des revenus",
    "features.db.h3": "Flux de projets récents",
    "features.db.h4": "Vue globale des statuts",
    
    "features.calc.title": "Calcul des coûts et bénéfices en direct",
    "features.calc.subtitle": "Saisissez le coût des matériaux, les dimensions des plaques, le temps laser, l'électricité, l'usure de la machine et la main-d'œuvre. Visualisez instantanément la ventilation des coûts et le prix recommandé.",
    "features.calc.h1": "Coût matière par unité",
    "features.calc.h2": "Suivi machine et énergie",
    "features.calc.h3": "Calculateur de marge",
    "features.calc.h4": "Tarification recommandée",
    
    "features.inv.title": "Évaluation des stocks et alertes en direct",
    "features.inv.subtitle": "Suivez le bois, l'acrylique et vos matériaux personnalisés par feuille ou par taille de chute. Recevez des notifications automatiques dès qu'un niveau de stock est critique.",
    "features.inv.h1": "Registres bois et acrylique",
    "features.inv.h2": "Alertes de stock bas",
    "features.inv.h3": "Déduction automatique du stock",
    "features.inv.h4": "Suivi du coût unitaire",
    
    "features.orders.title": "Pipeline de production visuel",
    "features.orders.subtitle": "Suivez l'état de chaque commande, de la demande de devis à la livraison finale. Fixez des délais, enregistrez les paiements et ajoutez des photos.",
    "features.orders.h1": "Tableau de statuts interactif",
    "features.orders.h2": "Gestion des relations clients",
    "features.orders.h3": "Suivi des revenus et des soldes",
    "features.orders.h4": "Calendrier des dates limites",
    
    "features.presets.title": "Votre bibliothèque de réglages d'atelier",
    "features.presets.subtitle": "Ne gaspillez plus de temps et de matière en tests de découpe. Enregistrez la vitesse, la puissance, la fréquence et le flux d'air pour chaque type de laser.",
    "features.presets.h1": "Support multi-machines",
    "features.presets.h2": "Onglets d'épaisseur matière",
    "features.presets.h3": "Modes Vecteur vs Gravure",
    "features.presets.h4": "Recherche de réglages rapide",

    // Interactive Mockup Texts
    "mock.total": "Total",
    "mock.inprogress": "En Cours",
    "mock.completed": "Terminé",
    "mock.revenue": "Revenu",
    "mock.recent": "PROJETS RÉCENTS",
    "mock.coasters": "Sous-verres Perso",
    "mock.birch": "Bouleau Contreplaqué 3mm",
    "mock.sheet": "Coût Plaque",
    "mock.usage": "Utilisation",
    "mock.laser": "Temps Laser",
    "mock.labor": "Main-d'œuvre",
    "mock.cost": "Coût Total",
    "mock.price": "Prix Rec.",
    "mock.wood": "Bois - Bouleau 3mm",
    "mock.acrylic": "Acrylique - Rouge 3mm",
    "mock.sheets": "plaques",
    "mock.stock": "En Stock",
    "mock.pending": "En attente",
    "mock.deliv": "Livré",
    "mock.bal": "Reste Dû",
    "mock.speed": "Vitesse",
    "mock.power": "Puissance",
    
    // Comparison
    "comp.badge": "Comparatif",
    "comp.title": "Feuilles de calcul vs",
    "comp.titleAccent": "0Machine",
    "comp.subtitle": "Pourquoi les créateurs abandonnent Excel pour un planificateur dédié.",
    "comp.col.old": "Méthode Traditionnelle",
    "comp.col.new": "La Méthode 0Machine",
    "comp.old.1": "Tarification calculée au pifomètre — perte d'argent un projet sur deux",
    "comp.old.2": "Fichiers de conception éparpillés sur clés USB, dossiers de bureau et applications de messagerie",
    "comp.old.3": "Revenus suivis sur des tableurs désordonnés — aucune idée de la rentabilité réelle",
    "comp.old.4": "Paramètres laser écrits sur des post-it — mauvaise puissance, matière gaspillée",
    "comp.old.5": "Commandes gérées de tête — dates limites manquées et clients oubliés",
    "comp.old.6": "Pénuries de matériaux découvertes en plein travail — production arrêtée, clients en attente",
    "comp.new.1": "Le calculateur indique instantanément le coût de revient réel et le prix de vente conseillé",
    "comp.new.2": "Chaque projet est organisé avec photos, coûts, temps, matériaux et infos clients",
    "comp.new.3": "Des analyses intelligentes indiquent les revenus, les meilleurs projets et les tendances",
    "comp.new.4": "Préréglages laser chargés en 10 secondes — des réglages parfaits à chaque fois",
    "comp.new.5": "Suivi des commandes en cours avec dates limites et coordonnées clients",
    "comp.new.6": "L'inventaire affiche en direct les niveaux de stock et la valeur totale — plus de panne",
    
    // Workflow
    "flow.badge": "Fonctionnement",
    "flow.title": "De la configuration à la livraison en",
    "flow.titleAccent": "4 étapes",
    "flow.step1.title": "Créer & Organiser",
    "flow.step1.desc": "Ajoutez votre projet avec matériaux, photos et détails clients. Utilisez des modèles pour lancer des tâches récurrentes en un clic.",
    "flow.step2.title": "Calculer & Chiffrer",
    "flow.step2.desc": "Utilisez le calculateur de coûts pour obtenir votre coût de revient réel : matière, temps machine, main-d'œuvre, énergie. Générez un devis pro.",
    "flow.step3.title": "Produire & Suivre",
    "flow.step3.desc": "Chargez vos préréglages laser, lancez le minuteur intégré et suivez la progression. Les commandes passent d'en attente à en cours automatiquement.",
    "flow.step4.title": "Livrer & Développer",
    "flow.step4.desc": "Exportez des rapports PDF, analysez vos statistiques et découvrez les projets les plus rentables. Développez-vous grâce aux données.",

    // Product Showcase
    "showcase.badge": "Interface Produit",
    "showcase.title": "Conçu pour votre navigateur et mobile",
    "showcase.subtitle": "Accédez à votre tableau de bord depuis votre tablette d'atelier ou votre smartphone.",
    
    // Social Proof
    "social.badge": "Témoignages",
    "social.title": "Recommandé par les créateurs",
    "social.subtitle": "Ce que les propriétaires d'ateliers disent de 0Machine Planner.",
    "social.role.laser": "Propriétaire d'Atelier Laser",
    "social.role.cnc": "Artisan CNC",
    "social.role.engrave": "Graveur Personnalisé",
    
    // Pricing
    "price.badge": "Tarifs Simples",
    "price.title": "Un Seul Plan. Tout Est",
    "price.titleAccent": "Inclus.",
    "price.subtitle": "Commencez gratuitement, passez à l'offre supérieure quand vous le souhaitez. Pas de frais cachés.",
    "price.trial.name": "Essai Gratuit",
    "price.trial.price": "0 $",
    "price.trial.period": "pendant 3 jours",
    "price.trial.desc": "Essayez toutes les fonctionnalités sans risque. Pas de carte de crédit requise.",
    "price.trial.f1": "Projets illimités",
    "price.trial.f2": "Calculateur de coûts",
    "price.trial.f3": "Inventaire des matériaux",
    "price.trial.f4": "Gestion des commandes",
    "price.trial.f5": "Préréglages laser",
    "price.trial.f6": "Statistiques de base",
    "price.trial.cta": "Essai Gratuit",
    "price.pro.name": "Pro",
    "price.pro.price": "9 $",
    "price.pro.period": "/mois",
    "price.pro.desc": "Tout ce dont vous avez besoin pour gérer un atelier laser rentable.",
    "price.pro.f.title": "Tout ce qui est dans l'Essai, plus :",
    "price.pro.f1": "Export de rapports en PDF",
    "price.pro.f2": "Analyses & stats avancées",
    "price.pro.f3": "Gestionnaire de clients",
    "price.pro.f4": "Photos de projets",
    "price.pro.f5": "Modèles de projets",
    "price.pro.f6": "Profils de machines",
    "price.pro.f7": "Générateur de devis",
    "price.pro.f8": "Estimateur d'imbrication",
    "price.pro.f9": "Support prioritaire",
    "price.pro.cta": "Obtenir l'Accès Pro",
    "price.popular": "Le Plus Populaire",
    
    // Final CTA
    "final.title": "Arrêtez de gérer votre",
    "final.titleMid": "atelier sur des",
    "final.titleAccent": "tableurs.",
    "final.subtitle": "Rejoignez des centaines d'artisans laser et CNC qui ont choisi 0Machine pour connaître leurs coûts réels, suivre chaque commande et développer leur activité sereinement.",
    "final.cta.trial": "⚡ Commencer l'Essai Gratuit",
    "final.cta.features": "Explorer les Fonctionnalités",
    "final.terms": "3 jours gratuits · 9 $/mois ensuite · Annulez à tout moment · Pas de carte requise",
    
    // Footer
    "foot.desc": "Le planificateur tout-en-un pour les ateliers de découpe laser et CNC. Suivez tout. Développez votre entreprise.",
    "foot.hours": "Lun - Ven : 9h00 - 17h00 MST",
    "foot.payments": "Paiements sécurisés via Stripe",
    "foot.billed": "Facturé mensuellement",
    "foot.cancel": "Annulation à tout moment",
    "foot.copyright": "© 2026 0Machine Planner. Conçu pour les créateurs. ⚡"
  },
  es: {
    // Loader
    "loader.loading": "Cargando experiencia...",
    // Navbar
    "nav.features": "Características",
    "nav.benefits": "Beneficios",
    "nav.workflow": "Cómo Funciona",
    "nav.pricing": "Precios",
    "nav.signin": "Conexión",
    "nav.trial": "Prueba Gratuita",
    
    // Hero
    "hero.badge": "Creado para creadores de Láser y CNC",
    "hero.title1": "Gestione su negocio",
    "hero.title2": "de láser ",
    "hero.titleAccent": "más inteligentemente.",
    "hero.subtitle": "Realice un seguimiento de materiales, calcule costos, gestione clientes y genere presupuestos, todo desde una hermosa aplicación diseñada para cortadoras láser y creadores de CNC.",
    "hero.ctaTrial": "⚡ Prueba Gratuita",
    "hero.ctaFeatures": "Características →",
    "hero.trialNote": "3 días gratis · luego $9/mes · cancele cuando quiera",
    
    // Benefits
    "benefits.badge": "Beneficios Reales",
    "benefits.title": "Cada función le ahorra",
    "benefits.titleAccent": "Tiempo y Dinero",
    "benefits.subtitle": "Así es como 0Machine le ayuda a dejar de perder horas en administración para enfocarse en sus ganancias.",
    
    "benefits.calc.feature": "Calculadora de Costos",
    "benefits.calc.title": "Conozca su costo real por trabajo — al instante",
    "benefits.calc.desc": "Introduzca materiales, tiempo de láser, electricidad, mano de obra y desgaste de la máquina. Obtenga un desglose de costos en tiempo real con el precio de venta recomendado. Nunca vuelva a cobrar de menos por un trabajo.",
    "benefits.calc.outcome": "Deje de perder dinero en trabajos que creía que eran rentables",
    "benefits.calc.stat": "3x",
    "benefits.calc.statLabel": "devisas más rápidas",
    
    "benefits.inv.feature": "Inventario de Materiales",
    "benefits.inv.title": "Siga cada hoja, cada corte, cada centavo",
    "benefits.inv.desc": "Gestione su inventario de madera contrachapada, acrílico, MDF y cuero con el valor del inventario en tiempo real. Reciba alertas de stock bajo antes de quedarse sin material a mitad del proyecto.",
    "benefits.inv.outcome": "Elimine la escasez sorpresa de materiales durante la producción",
    "benefits.inv.stat": "0",
    "benefits.inv.statLabel": "faltas de stock",
    
    "benefits.order.feature": "Gestión de Pedidos",
    "benefits.order.title": "Cada pedido rastreado desde la solicitud hasta la entrega",
    "benefits.order.desc": "Vea todos los pedidos de un vistazo: Pendientes, En curso, Completados. Rastree nombres de clientes, fechas de vencimiento, ingresos obtenidos y pagos pendientes.",
    "benefits.order.outcome": "Nunca pierda una fecha límite ni olvide el pedido de un cliente",
    "benefits.order.stat": "100%",
    "benefits.order.statLabel": "visibilidad de pedidos",
    
    "benefits.presets.feature": "Ajustes de Láser",
    "benefits.presets.title": "Ajustes perfectos cada vez, sin adivinanzas",
    "benefits.presets.desc": "Guarde la velocidad, potencia, frecuencia, pasadas y ajustes de asistencia de aire por material. Cargue los ajustes preestablecidos al instante al cambiar de material.",
    "benefits.presets.outcome": "Reduzca el desperdicio de material debido a una configuración incorrecta de la máquina",
    "benefits.presets.stat": "10s",
    "benefits.presets.statLabel": "para cargar",
    
    "benefits.quote.feature": "Generador de Presupuestos",
    "benefits.quote.title": "Envíe presupuestos profesionales en menos de un minuto",
    "benefits.quote.desc": "Cree presupuestos detallados con artículos, IVA y totales. Luzca profesional y cierre tratos más rápido con documentos listos para el cliente.",
    "benefits.quote.outcome": "Gane más clientes con presupuestos profesionales e instantáneos",
    "benefits.quote.stat": "60s",
    "benefits.quote.statLabel": "para enviar",
    
    "benefits.nest.feature": "Estimador de Nesting",
    "benefits.nest.title": "Maximice cada hoja, minimice el desperdicio",
    "benefits.nest.desc": "Calcule cuántas piezas caben en una hoja antes de cortar. Optimice el uso del material y reduzca los retales en cada trabajo.",
    "benefits.nest.outcome": "Ahorre hasta un 30% en costos de material con un nesting más inteligente",
    "benefits.nest.stat": "30%",
    "benefits.nest.statLabel": "menos residuo",

    // Feature Showcase
    "features.badge": "Características",
    "features.title": "Diseñado para su forma de trabajar",
    "features.subtitle": "Explore las herramientas clave que facilitan la gestión de su taller al día.",
    
    "features.tab.dashboard": "Panel de Control",
    "features.tab.calc": "Calculadora",
    "features.tab.inventory": "Inventario",
    "features.tab.orders": "Pedidos",
    "features.tab.presets": "Ajustes",
    
    "features.db.title": "Todo su taller en un solo vistazo",
    "features.db.subtitle": "Consulte proyectos totales, trabajos activos, trabajo completado e ingresos de un vistazo. No más adivinanzas.",
    "features.db.h1": "Estadísticas en tiempo real",
    "features.db.h2": "Seguimiento de ingresos",
    "features.db.h3": "Proyectos recientes",
    "features.db.h4": "Resumen de estados",
    
    "features.calc.title": "Cálculo de costos y ganancias en vivo",
    "features.calc.subtitle": "Introduzca costos, dimensiones, tiempo de láser, energía y mano de obra. Vea instantáneamente el desglose detallado de costos y el precio recomendado.",
    "features.calc.h1": "Costo por unidad de material",
    "features.calc.h2": "Seguimiento de máquina y energía",
    "features.calc.h3": "Calculadora de margen",
    "features.calc.h4": "Precios recomendados",
    
    "features.inv.title": "Valoración de inventario y alertas en vivo",
    "features.inv.subtitle": "Rastree madera, acrílico y materiales personalizados por hoja o sobrante. Reciba notificaciones automáticas cuando el stock esté bajo.",
    "features.inv.h1": "Registro de madera y acrílico",
    "features.inv.h2": "Alertas de stock bajo",
    "features.inv.h3": "Deducción automática de stock",
    "features.inv.h4": "Costo por material",
    
    "features.orders.title": "Pipeline de producción visual",
    "features.orders.subtitle": "Siga el estado desde la solicitud de presupuesto hasta la entrega final. Defina fechas, registre pagos y añada fotos de proyectos.",
    "features.orders.h1": "Tablero de estados interactivo",
    "features.orders.h2": "Seguimiento de clientes",
    "features.orders.h3": "Registro de ingresos y saldos",
    "features.orders.h4": "Calendarios de entrega",
    
    "features.presets.title": "Biblioteca de ajustes de taller",
    "features.presets.subtitle": "No vuelva a desperdiciar material en pruebas. Guarde velocidad, potencia, frecuencia y flujo de aire para cada láser.",
    "features.presets.h1": "Soporte multi-máquina",
    "features.presets.h2": "Pestañas de espesores",
    "features.presets.h3": "Modos Vector vs Grabado",
    "features.presets.h4": "Búsqueda rápida de ajustes",

    // Interactive Mockup Texts
    "mock.total": "Total",
    "mock.inprogress": "En Proceso",
    "mock.completed": "Completado",
    "mock.revenue": "Ingresos",
    "mock.recent": "PROYECTOS RECIENTES",
    "mock.coasters": "Posavasos Perso",
    "mock.birch": "Abedul Contrachapado 3mm",
    "mock.sheet": "Costo de Hoja",
    "mock.usage": "Uso",
    "mock.laser": "Tiempo Láser",
    "mock.labor": "Mano de Obra",
    "mock.cost": "Costo Total",
    "mock.price": "Precio Rec.",
    "mock.wood": "Madera - Abedul 3mm",
    "mock.acrylic": "Acrílico - Rojo 3mm",
    "mock.sheets": "hojas",
    "mock.stock": "En Stock",
    "mock.pending": "Pendiente",
    "mock.deliv": "Entregado",
    "mock.bal": "Saldo Pend.",
    "mock.speed": "Velocidad",
    "mock.power": "Potencia",
    
    // Comparison
    "comp.badge": "Comparativa",
    "comp.title": "Hojas de cálculo vs",
    "comp.titleAccent": "0Machine",
    "comp.subtitle": "Por qué los creadores están dejando Excel por un planificador dedicado.",
    "comp.col.old": "Método Tradicional",
    "comp.col.new": "El Método 0Machine",
    "comp.old.1": "Precios calculados por intuición: perdiendo dinero en uno de cada dos trabajos",
    "comp.old.2": "Archivos de diseño dispersos en USB, carpetas de escritorio y chats",
    "comp.old.3": "Ingresos rastreados en hojas de cálculo desordenadas: sin saber qué es rentable",
    "comp.old.4": "Ajustes de láser anotados en post-its: potencia incorrecta y material desperdiciado",
    "comp.old.5": "Pedidos gestionados de memoria: plazos vencidos y clientes olvidados",
    "comp.old.6": "Faltas de material a mitad del trabajo: producción detenida y clientes esperando",
    "comp.new.1": "La calculadora muestra el costo real de producción y el precio sugerido al instante",
    "comp.new.2": "Cada proyecto organizado con fotos, costos, tiempo, materiales e información de clientes",
    "comp.new.3": "Los análisis muestran ingresos, proyectos estrella, tasas de éxito y tendencias",
    "comp.new.4": "Ajustes preestablecidos cargados en 10 segundos: configuración perfecta cada vez",
    "comp.new.5": "Pedidos rastreados con fechas de entrega y nombres de clientes",
    "comp.new.6": "El inventario muestra niveles de stock y el valor total en tiempo real para no quedarse sin nada",
    
    // Workflow
    "flow.badge": "Cómo Funciona",
    "flow.title": "De la configuración a la entrega en",
    "flow.titleAccent": "4 pasos",
    "flow.step1.title": "Crear y Organizar",
    "flow.step1.desc": "Añada su proyecto con materiales, fotos y detalles de clientes. Use plantillas para iniciar tareas recurrentes en segundos.",
    "flow.step2.title": "Calcular y Cotizar",
    "flow.step2.desc": "Use la calculadora para obtener su costo real: material, tiempo de máquina, mano de obra, energía. Genere presupuestos pro.",
    "flow.step3.title": "Producir y Seguir",
    "flow.step3.desc": "Cargue sus ajustes de láser, inicie el temporizador y siga el progreso. Los pedidos cambian a en curso automáticamente.",
    "flow.step4.title": "Entregar y Crecer",
    "flow.step4.desc": "Exporte reportes PDF, analice sus estadísticas y descubra qué proyectos generan más ingresos. Crezca con datos, no con dudas.",

    // Product Showcase
    "showcase.badge": "Interfaz de Producto",
    "showcase.title": "Creado para su navegador y móvil",
    "showcase.subtitle": "Acceda a su panel de control desde la tableta de su taller o su teléfono móvil.",
    
    // Social Proof
    "social.badge": "Testimonios",
    "social.title": "Recomendado por los creadores",
    "social.subtitle": "Lo que dicen los dueños de talleres sobre 0Machine Planner.",
    "social.role.laser": "Dueño de Taller Láser",
    "social.role.cnc": "Artesano CNC",
    "social.role.engrave": "Grabador Personalizado",
    
    // Pricing
    "price.badge": "Precios Simples",
    "price.title": "Un Solo Plan. Todo",
    "price.titleAccent": "Incluido.",
    "price.subtitle": "Empiece gratis, actualice cuando esté listo. Sin tarifas ocultas.",
    "price.trial.name": "Prueba Gratuita",
    "price.trial.price": "$0",
    "price.trial.period": "por 3 días",
    "price.trial.desc": "Pruebe todas las funciones sin riesgo. No se requiere tarjeta de crédito.",
    "price.trial.f1": "Proyectos ilimitados",
    "price.trial.f2": "Calculadora de costos",
    "price.trial.f3": "Inventario de materiales",
    "price.trial.f4": "Gestión de pedidos",
    "price.trial.f5": "Ajustes de láser",
    "price.trial.f6": "Estadísticas básicas",
    "price.trial.cta": "Iniciar Prueba Gratis",
    "price.pro.name": "Pro",
    "price.pro.price": "$9",
    "price.pro.period": "/mes",
    "price.pro.desc": "Todo lo que necesita para dirigir un taller de láser rentable.",
    "price.pro.f.title": "Todo lo que hay en la Prueba, más:",
    "price.pro.f1": "Exportación de informes en PDF",
    "price.pro.f2": "Análisis y estadísticas avanzadas",
    "price.pro.f3": "Gestor de clientes",
    "price.pro.f4": "Fotos de proyectos",
    "price.pro.f5": "Plantillas de proyectos",
    "price.pro.f6": "Perfiles de máquinas",
    "price.pro.f7": "Generador de presupuestos",
    "price.pro.f8": "Estimador de nesting",
    "price.pro.f9": "Soporte prioritario",
    "price.pro.cta": "Obtener Acceso Pro",
    "price.popular": "Más Popular",
    
    // Final CTA
    "final.title": "Deje de gestionar su",
    "final.titleMid": "taller en hojas",
    "final.titleAccent": "de cálculo.",
    "final.subtitle": "Únase a cientos de creadores de láser y CNC que eligieron 0Machine para conocer sus costos reales, seguir cada pedido y hacer crecer su negocio con confianza.",
    "final.cta.trial": "⚡ Iniciar Prueba Gratuita",
    "final.cta.features": "Explorar Características",
    "final.terms": "3 días gratis · $9/mes después · Cancele cuando quiera · Sin tarjeta requerida",
    
    // Footer
    "foot.desc": "El planificador todo en uno para talleres de corte láser y CNC. Rastree todo. Haga crecer su negocio.",
    "foot.hours": "Lun - Vie: 9:00 - 17:00 MST",
    "foot.payments": "Pagos seguros a través de Stripe",
    "foot.billed": "Facturado mensualmente",
    "foot.cancel": "Cancele cuando quiera",
    "foot.copyright": "© 2026 0Machine Planner. Creado para makers. ⚡"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  // Load preferred language from localStorage after hydration, or auto-detect from browser
  useEffect(() => {
    const saved = localStorage.getItem("preferred_language");
    if (saved && ["en", "fr", "es"].includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
      if (browserLang) {
        const langCode = browserLang.substring(0, 2).toLowerCase();
        if (["en", "fr", "es"].includes(langCode)) {
          setLanguageState(langCode);
        }
      }
    }
  }, []);

  const setLanguage = (lang) => {
    if (["en", "fr", "es"].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem("preferred_language", lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
