// Generates deterministic, realistic mock datasets for 3D Bharat.
// Run with: npm run generate-data
// Outputs: data/deals.json and data/investors.json
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");

// Deterministic PRNG (mulberry32) so the data is stable across runs.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260714);

const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);
const intBetween = (min, max) => Math.floor(between(min, max + 1));
const round1 = (n) => Math.round(n * 10) / 10;

const INDUSTRIES = [
  "Fintech", "Healthcare", "EdTech", "E-commerce", "SaaS", "AgriTech",
  "Logistics", "Renewable Energy", "Real Estate", "Manufacturing",
  "Media & Entertainment", "Travel & Hospitality",
];

const LOCATIONS = [
  "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Chennai", "Pune",
  "Ahmedabad", "Jaipur", "Kolkata", "Kochi", "Indore", "Gurugram",
];

const COMPANY_POOL = {
  Fintech: ["PayNest", "FinSathi", "LedgerLabs", "RupeeFlow", "CreditSarthi", "WalletX", "UdyogPay", "NiyoCapital", "DigiLedger", "TerabytePay"],
  Healthcare: ["MediCarePlus", "ArogyaLabs", "Healthbridge", "VitalNest", "CareSync", "MediRoute", "AyuHealth", "BioPulse", "TheraWell", "SwasthyaTech"],
  EdTech: ["SkillSpring", "LearnVerse", "VidyaHub", "EduMentor", "ClassBridge", "BrightPath", "TalentNest", "CodeCampus", "GyaanSetu", "MindMatter"],
  "E-commerce": ["ShopKart", "BazaarNow", "ThriveCart", "UrbanKart", "FlipNest", "LocalBasket", "StyleScape", "HomeNest", "GoodsGuru", "CartWise"],
  SaaS: ["CloudNimbus", "StackForge", "DataPulse", "OperaFlow", "SaaSGrid", "NimbusLab", "WorkOrbit", "MetricHub", "TaskBridge", "ContextIQ"],
  AgriTech: ["FarmSense", "KrishiLink", "AgroPulse", "GreenHarvest", "SoilScore", "CropNest", "FarmGrid", "HarvestHub", "AgriTrack", "FasalFlow"],
  Logistics: ["RouteStar", "FreightFlow", "ShipNest", "CargoPulse", "LastMileX", "LoadBoard", "TransWise", "DeliveryDesk", "FleetCore", "ParcelPath"],
  "Renewable Energy": ["SolarNova", "GreenVolt", "EcoGrid", "SolarStream", "WindWise", "CleanCharge", "NetZero", "SunBridge", "PowerPulse", "VayuEnergy"],
  "Real Estate": ["UrbanNest", "PropConnect", "HomeVista", "BuildSmart", "LandMark", "EstateHub", "Skyline", "PropShop", "DwellNest", "RealKey"],
  Manufacturing: ["MachineWorks", "ForgeLine", "SteelCore", "PrecisionX", "InduMech", "FabCore", "MetalCraft", "AutoPartsX", "TextilePro", "GreenFab"],
  "Media & Entertainment": ["StreamVerse", "SoundWaves", "ReelTime", "PixelPlay", "StoryNest", "MediaMix", "CinemaOne", "PodSphere", "TrendCast", "ShowBizz"],
  "Travel & Hospitality": ["WanderNest", "TripBuddy", "StayEasy", "RoamOn", "TrailBlaze", "HotelHive", "VoyageX", "ResortReach", "LocalGo", "NomadNest"],
};

const DESCRIPTION_TEMPLATES = {
  Fintech: ["A digital lending platform building credit rails for underserved small businesses with AI-driven underwriting.", "A neo-banking startup offering zero-fee accounts, smart savings and instant UPI-based credit for millennials.", "An invoice financing marketplace connecting MSME suppliers with institutional capital through a transparent ledger."],
  Healthcare: ["A telemedicine network expanding affordable specialist consultations to tier-2 and tier-3 cities.", "An AI-powered diagnostics platform reducing turnaround time for lab reports across 40+ cities.", "A home-care company delivering chronic disease management services on a subscription model."],
  EdTech: ["A skill-based learning platform with live cohorts and placement support for in-demand tech jobs.", "An adaptive test-prep app personalising study paths for competitive exams using analytics.", "A vernacular micro-credential marketplace making vocational courses accessible in regional languages."],
  "E-commerce": ["A curated direct-to-consumer brand marketplace with a hyperlocal fulfilment network.", "A social commerce platform enabling micro-influencers to run storefronts without holding inventory.", "A quick-commerce grocery service focused on fresh produce sourced directly from farm clusters."],
  SaaS: ["A subscription analytics platform helping SaaS teams reduce churn through usage intelligence.", "An AI workflow automation tool unifying document, CRM and communication data for ops teams.", "A vertical CRM built for field-service companies to dispatch, track and invoice from one workspace."],
  AgriTech: ["An IoT-enabled precision farming platform providing soil health and irrigation recommendations.", "A farm-to-retail procurement network that guarantees prices and reduces post-harvest losses.", "A cold-chain logistics startup connecting farmers with processors through tracked warehousing."],
  Logistics: ["A tech-enabled freight aggregation marketplace matching shippers with verified carriers in real time.", "A last-mile delivery platform optimising routes with dynamic algorithms for e-commerce parcels.", "A shared warehousing network enabling small businesses to scale fulfilment without fixed leases."],
  "Renewable Energy": ["A rooftop solar installer offering financing and maintenance as a single bundled subscription.", "A community solar micro-grid company powering rural industrial clusters with stored clean energy.", "A green hydrogen start-up developing electrolyser technology for industrial decarbonisation."],
  "Real Estate": ["A fractional ownership platform letting investors buy rental property units at small ticket sizes.", "A proptech software digitising lease management, maintenance and tenant communication for landlords.", "A co-living operator building managed student housing across university clusters in India."],
  Manufacturing: ["An additive manufacturing bureau producing precision components for automotive and aerospace clients.", "A smart-factory retrofit company deploying IoT sensors and analytics to cut downtime in SME plants.", "A sustainable packaging manufacturer switching FMCG brands to compostable alternatives."],
  "Media & Entertainment": ["A short-form video studio producing regional-language original content for connected TV.", "A music distribution platform helping independent artists monetise royalties across streaming services.", "A podcast network building a niche audience in finance, wellness and technology verticals."],
  "Travel & Hospitality": ["A boutique hotel marketplace curating heritage stays with direct booking incentives.", "A travel-tech platform offering bundled flight, hotel and experience packages with dynamic pricing.", "A workation ecosystem building long-stay hospitality near scenic destinations for remote teams."],
};

function generateDeals(count) {
  const deals = [];
  let n = 0;
  const now = Date.now();
  while (deals.length < count) {
    for (const industry of INDUSTRIES) {
      if (deals.length >= count) break;
      n += 1;
      const ageYears = intBetween(2, 14);
      const foundedYear = new Date().getFullYear() - ageYears;

      const scale = {
        Fintech: 2.2, Healthcare: 1.9, EdTech: 1.4, "E-commerce": 1.5, SaaS: 1.8,
        AgriTech: 1.1, Logistics: 1.3, "Renewable Energy": 2.4, "Real Estate": 2.0,
        Manufacturing: 1.6, "Media & Entertainment": 1.2, "Travel & Hospitality": 1.0,
      }[industry];

      const growthRate = intBetween(8, 85);
      const riskRoll = rand();
      const riskLevel = riskRoll < 0.3 ? "Low" : riskRoll < 0.62 ? "Moderate" : riskRoll < 0.86 ? "High" : "Very High";

      const roiBase = { Low: 10, Moderate: 16, High: 24, "Very High": 32 }[riskLevel];
      const expectedROI = round1(roiBase + between(0, 10) + growthRate * 0.12);

      const investmentRequired = Math.round(intBetween(80, 4200) * scale * 100000);
      const minimumInvestment = Math.round((investmentRequired * between(0.002, 0.01)) / 1000) * 1000;
      const maximumInvestment = Math.round((investmentRequired * between(0.08, 0.35)) / 1000) * 1000;
      const fundingProgress = intBetween(4, 100);
      const investorCount = Math.max(1, Math.round((fundingProgress / 100) * intBetween(4, 60) + intBetween(1, 12)));
      const revenue = Math.round(investmentRequired * between(0.5, 3.2));
      const profit = Math.round(revenue * between(-0.25, 0.3));

      const statusRoll = rand();
      const dealStatus = fundingProgress >= 100 ? "Closed" : statusRoll < 0.08 ? "Coming Soon" : "Open";

      const duration = intBetween(6, 60);
      const createdAt = new Date(now - intBetween(2, 420) * 24 * 3600 * 1000).toISOString();

      deals.push({
        id: `deal-${String(n).padStart(3, "0")}`,
        companyName: pick(COMPANY_POOL[industry]) + (rand() < 0.35 ? " Technologies" : ""),
        industry,
        description: pick(DESCRIPTION_TEMPLATES[industry]),
        location: pick(LOCATIONS),
        investmentRequired,
        minimumInvestment: Math.max(minimumInvestment, 50000),
        maximumInvestment: Math.max(maximumInvestment, minimumInvestment),
        expectedROI: Math.min(expectedROI, 60),
        riskLevel,
        fundingProgress,
        investorCount,
        revenue,
        profit,
        growthRate,
        foundedYear,
        dealStatus,
        duration,
        createdAt,
      });
    }
  }
  return deals;
}



const INVESTOR_FIRST_NAMES = ["Arjun", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Karan", "Ishita", "Aditya", "Meera", "Rahul", "Divya", "Nikhil", "Pooja", "Sanjay", "Kavya"];
const INVESTOR_LAST_NAMES = ["Mehta", "Sharma", "Iyer", "Patel", "Reddy", "Nair", "Das", "Kapoor", "Menon", "Kulkarni", "Gupta", "Chopra", "Verma", "Bhat", "Joshi", "Rao"];

function generateInvestors(count, deals) {
  const investors = [];
  for (let i = 0; i < count; i += 1) {
    const first = pick(INVESTOR_FIRST_NAMES);
    const last = pick(INVESTOR_LAST_NAMES);
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
    const budget = intBetween(40, 800) * 100000;
    const preferredCount = intBetween(2, 4);
    const preferredIndustries = [...INDUSTRIES].sort(() => rand() - 0.5).slice(0, preferredCount);
    const riskPreference = pick(["Low", "Moderate", "Moderate", "High"]);
    const expectedROI = intBetween(12, 28);

    const holdingCount = intBetween(3, 8);
    const chosen = [...deals].sort(() => rand() - 0.5).slice(0, holdingCount);
    const now = Date.now();
    const portfolio = chosen.map((deal) => {
      const monthsBack = intBetween(1, 24);
      const amount = intBetween(2, 20) * 100000;
      return { dealId: deal.id, amount, date: new Date(now - monthsBack * 30 * 24 * 3600 * 1000).toISOString() };
    });
    const interestCount = intBetween(2, 6);
    const interests = [...deals].sort(() => rand() - 0.5).slice(0, interestCount).map((d) => d.id);

    investors.push({
      id: `inv-${String(i + 1).padStart(3, "0")}`,
      name,
      email,
      budget,
      preferredIndustries,
      riskPreference,
      expectedROI,
      portfolio,
      interests,
    });
  }
  return investors;
}

const deals = generateDeals(80);
const investors = generateInvestors(14, deals);

mkdirSync(dataDir, { recursive: true });
writeFileSync(join(dataDir, "deals.json"), JSON.stringify(deals, null, 2));
writeFileSync(join(dataDir, "investors.json"), JSON.stringify(investors, null, 2));

console.log(`Generated ${deals.length} deals and ${investors.length} investors.`);
console.log(`Industries: ${[...new Set(deals.map((d) => d.industry))].join(", ")}`);

