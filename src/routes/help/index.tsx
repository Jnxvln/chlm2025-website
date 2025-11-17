import { component$, useSignal, useComputed$, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import './help-center.css';
import helpData from '~/data/help.json';

// Type definitions
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  categories: string[];
  relatedLinks?: { text: string; url: string }[];
}

interface CoverageItem {
  id: number;
  thickness?: string;
  coverage?: string;
  size?: string;
  placement?: string;
  squareFeet?: string;
  linearFeet?: string;
}

export const HelpCenter = component$(() => {
  // State management
  const searchQuery = useSignal('');
  const storePhone = useSignal('903-334-7350');
  const selectedFaq = useSignal<FAQItem | null>(null);
  const scrollY = useSignal(0);
  const showScrollTop = useSignal(false);

  // FAQ Data - Loaded from JSON
  const faqs = useSignal<FAQItem[]>(helpData.faqs as FAQItem[]);

  // Coverage data - Loaded from JSON
  const coverageFlagstone: CoverageItem[] = helpData.coverage.flagstone as CoverageItem[];
  const coverageChoppedStone: CoverageItem[] = helpData.coverage.choppedStone as CoverageItem[];
  const coverageRiverRock: CoverageItem[] = helpData.coverage.riverRock as CoverageItem[];
  const coverageWaterfall: CoverageItem[] = helpData.coverage.waterfall as CoverageItem[];

  // Filtered FAQs based on search
  const filteredFaqs = useComputed$(() => {
    if (!searchQuery.value.trim()) {
      return faqs.value;
    }
    return faqs.value.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Track scroll position
  useVisibleTask$(({ cleanup }) => {
    const handleScroll = () => {
      scrollY.value = window.scrollY;
      showScrollTop.value = window.scrollY > 50;
    };
    
    window.addEventListener('scroll', handleScroll);
    cleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  // Clear search
  const clearSearch = $(() => {
    searchQuery.value = '';
    selectedFaq.value = null;
  });

  // Select FAQ
  const selectFaq = $((faq: FAQItem) => {
    selectedFaq.value = faq;
    searchQuery.value = faq.question;
  });

  return (
    <main class="help-main-section">
      {/* Page Header */}
      <header class="help-header">
        <div class="header-overlay"></div>
        <div class="header-background-image"></div>
        <h1 class="header-title">Help Center</h1>
      </header>

      {/* Question Search Bar */}
      <section class="question-bar">
        <div class="help-search-wrapper">
          <div class="search-input-wrapper">
            <input
              type="text"
              class="help-search-input"
              placeholder="Search for help..."
              value={searchQuery.value}
              onInput$={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
                selectedFaq.value = null;
              }}
            />
            {searchQuery.value && (
              <div class="search-suggestions">
                {filteredFaqs.value.slice(0, 5).map((faq) => (
                  <div
                    key={faq.id}
                    class="suggestion-item"
                    onClick$={() => selectFaq(faq)}
                  >
                    {faq.question}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button class="search-button" aria-label="Search">
            Search
          </button>
          {searchQuery.value && (
            <button class="clear-search-button" onClick$={clearSearch}>
              Clear
            </button>
          )}
        </div>

        {/* Display selected FAQ */}
        {selectedFaq.value && (
          <div class="response-area">
            <h2 class="display-question">{selectedFaq.value.question}</h2>
            <p class="display-answer">{selectedFaq.value.answer}</p>
            {selectedFaq.value.relatedLinks && selectedFaq.value.relatedLinks.length > 0 && (
              <div class="related-links">
                <h3>Related Links:</h3>
                {selectedFaq.value.relatedLinks.map((link, index) => (
                  <div key={index} class="help-related-link">
                    <a href={link.url}>{link.text}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* General Information Section */}
      <section class="general-information-section">
        <header class="general-info-header">
          <div class="general-info-background"></div>
          <div class="general-info-overlay"></div>
          <h1 class="general-info-title section-title">GENERAL INFORMATION</h1>
        </header>

        <div class="call-for-pricing">
          For pricing information, please call us at {storePhone.value}
        </div>

        <div class="material-types-container">
          {/* Left Column - Bulk Materials */}
          <div class="material-column">
            <div class="material-type-bulk">
              <div class="bulk-image-wrapper">
                <img 
                  src="/images/help/bulk-pile.png" 
                  alt="Bulk Pile" 
                  class="bulk-image"
                  width={300}
                  height={260}
                />
              </div>
              <h3 class="material-type-title">BULK MATERIAL</h3>
              <div class="material-list">
                <div class="material-type-name">Topsoil</div>
                <div class="material-type-name">Sand</div>
                <div class="material-type-name">Gravel</div>
                <div class="material-type-name">Mulch</div>
                <div class="material-type-name">Compost</div>
                <div class="material-type-name">Decorative Rock</div>
              </div>
            </div>
            
            <div class="loading-equipment">
              <p class="loading-label">We load with</p>
              <div class="equipment-image-wrapper">
                <img 
                  src="/images/help/skidsteer.png" 
                  alt="Skid Steer - Used for loading bulk materials" 
                  class="equipment-image"
                  width={250}
                  height={250}
                />
              </div>
              <p class="equipment-name">Skid Steer</p>
            </div>
          </div>

          {/* Right Column - Palletized Materials */}
          <div class="material-column">
            <div class="material-type-pallets">
              <div class="pallet-image-wrapper">
                <img 
                  src="/images/help/pallet-stone.png" 
                  alt="Pallet Stone" 
                  class="pallet-image"
                  width={300}
                  height={300}
                />
              </div>
              <h3 class="material-type-title">PALLETIZED STONE</h3>
              <div class="material-list">
                <div class="material-type-name">Flagstone</div>
                <div class="material-type-name">Chopped Stone</div>
                <div class="material-type-name">Wall Stone</div>
                <div class="material-type-name">Decorative Boulders</div>
                <div class="material-type-name">River Rock</div>
              </div>
            </div>
            
            <div class="loading-equipment">
              <p class="loading-label">We load with</p>
              <div class="equipment-image-wrapper">
                <img 
                  src="/images/help/forklift.png" 
                  alt="Forklift - Used for loading palletized materials" 
                  class="equipment-image"
                  width={250}
                  height={250}
                />
              </div>
              <p class="equipment-name">Forklift</p>
            </div>
          </div>
        </div>
      </section>

      {/* Weights Section */}
      <section id="weights" class="weights-section">
        <h1 class="section-title">WEIGHTS</h1>
        
        <div class="weights-content">
          <div class="weight-conversions">
            <h2 class="weight-subtitle">CONVERSIONS</h2>
            <p class="weight-info">1 cubic yard = 27 cubic feet</p>
            <p class="weight-info">1 ton = 2,000 pounds</p>
            
            <h3 class="weight-category">Typical Weight per Cubic Yard:</h3>
            <ul class="weight-list">
              <li><strong>Topsoil:</strong> 2,000 - 2,700 lbs</li>
              <li><strong>Sand (dry):</strong> 2,600 - 3,000 lbs</li>
              <li><strong>Sand (wet):</strong> 3,100 - 3,500 lbs</li>
              <li><strong>Gravel:</strong> 2,800 - 3,400 lbs</li>
              <li><strong>Mulch:</strong> 400 - 800 lbs</li>
              <li><strong>Compost:</strong> 1,000 - 1,600 lbs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" class="coverage-section">
        <h1 class="section-title">COVERAGE</h1>
        
        {/* Flagstone Coverage */}
        <div class="coverage-subsection">
          <h2 class="coverage-section-title">PALLETIZED STONE COVERAGE</h2>
          <div class="coverage-divider"></div>
          
          <div class="coverage-subtitle">
            FLAGSTONE <span class="per-ton">(PER TON)</span>
          </div>
          
          <div class="coverage-table-wrapper">
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Thickness</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {coverageFlagstone.map((item) => (
                  <tr key={item.id}>
                    <td>{item.thickness}</td>
                    <td>{item.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chopped Stone Coverage */}
          <div class="coverage-subtitle">
            CHOPPED STONE <span class="per-ton">(PER TON)</span>
          </div>
          
          <div class="coverage-table-wrapper">
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Placement</th>
                  <th>Square Feet</th>
                  <th>Linear Feet</th>
                </tr>
              </thead>
              <tbody>
                {coverageChoppedStone.map((item) => (
                  <tr key={item.id}>
                    <td>{item.size}</td>
                    <td>{item.placement}</td>
                    <td>{item.squareFeet}</td>
                    <td>{item.linearFeet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* River Rock Coverage */}
          <div class="coverage-subtitle">
            RIVER ROCK <span class="per-ton">(PER TON)</span>
          </div>
          
          <div class="coverage-table-wrapper">
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Thickness</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {coverageRiverRock.map((item) => (
                  <tr key={item.id}>
                    <td>{item.thickness}</td>
                    <td>{item.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Waterfall Rock Coverage */}
          <div class="coverage-subtitle">
            WATERFALL ROCK <span class="per-ton">(PER TON)</span>
          </div>
          
          <div class="coverage-table-wrapper">
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Thickness</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {coverageWaterfall.map((item) => (
                  <tr key={item.id}>
                    <td>{item.thickness}</td>
                    <td>{item.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Small Flat Creek Rock */}
          <div class="coverage-subtitle">
            SMALL FLAT CREEK ROCK <span class="per-ton">(PER TON)</span>
          </div>
          <p>About 100 - 110 sqft/ton</p>
        </div>

        {/* Bulk Materials Coverage */}
        <div class="coverage-subsection">
          <h2 class="coverage-section-title">BULK MATERIALS COVERAGE</h2>
          <div class="coverage-divider"></div>
          
          <div class="coverage-subtitle">
            1" - 1.5" ROCK, SOIL, SAND, COMPOST, & MULCH <span class="per-ton">(PER CUBIC YARD)</span>
          </div>
          
          <p class="coverage-info">
            1 cubic yard roughly covers a 10' x 16' area at 2" deep (about the size of a parking space)
          </p>

          <div class="bulk-rectangle-wrapper">
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
              <text x="40%" y="10%" fill="#B78B19" font-weight="bold">16 ft</text>
              <text x="0" y="50%" fill="#B78B19" font-weight="bold">10 ft</text>
              <rect width="230" height="150" x={45} y={25} fill="#4685A9"/>
            </svg>
            <div class="small-text">1 cu yd = approx. 10' x 16' at 2" deep</div>
            
            <div class="calculator-link-wrapper">
              <a href="/calculator" class="calculator-link">
                Try Bulk Material Calculator
              </a>
            </div>
          </div>

          {/* Coverage Formula */}
          <div class="coverage-formula-section">
            <div class="coverage-subtitle">COVERAGE FORMULA</div>
            <p>
              For <strong>square</strong> and <strong>rectangle</strong> shaped projects, 
              you can use the following formula to approximate how much you need:
            </p>

            <div class="formula-display">
              <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
                <text x={15} y={20}>Length' x Width' x Depth"</text>
                <line x1={5} x2={225} y1={30} y2={30} stroke="black"/>
                <text x={100} y={50}>324</text>
                <text x={15} y={90} font-size="18">=</text>
                <text x={40} y={90} font-size="16">cubic yards (approx.)</text>
              </svg>

              <div class="bulk-formula-disclaimer">
                NOTE: Length and Width must be in <strong>feet</strong>. 
                Depth must be in <strong>inches.</strong>
              </div>

              <div class="message-try-calculator">
                For other shapes, or if you don't want to figure manually,{' '}
                <a href="/calculator" class="message-try-calculator-link">
                  try our online cubic yards calculator.
                </a>
              </div>
            </div>
          </div>

          <div class="coverage-subtitle">FOR LARGER ROCK</div>
          <p>
            The best we can do is use the same formula (or the calculator) and add an 
            additional 1/2yd - 1yd. Basically, the larger the material, the lesser the 
            square-foot coverage received since our bucket is a fixed size.
          </p>
        </div>
      </section>

      {/* Loading Information Section */}
      <section id="loading" class="loading-info-section">
        <header>
          <h1 class="section-title">LOADING INFO</h1>
        </header>

        <div class="loading-info-subsection">
          <div class="loading-section-subtitle">PICKUP TRUCKS</div>

          <div class="loading-category">
            <div class="coverage-subtitle">1/2-Ton Pickups</div>
            <p>
              We can usually load a 1/2 yard of our heavy materials (topsoil, sand, and gravels) 
              into the bed, or usually 1 yard of the lighter materials (compost and mulch.) 
              Low-pressure tires carry less and are potentially dangerous.
            </p>
          </div>

          <div class="loading-category">
            <div class="coverage-subtitle">3/4-Ton and 1-Ton Trucks</div>
            <p>
              We can usually load 1 yard of our heavy materials (topsoil, sand, and gravels) 
              into the bed, or 1.5 to 2 yards of the lighter materials (compost and mulch.) 
              Low-pressure tires carry less and are potentially dangerous.
            </p>
          </div>

          <div class="loading-section-subtitle">TRAILERS</div>
          
          <p class="loading-info-text">
            The amount we'll load may depend on several factors: the number of axles your 
            trailer has, the length of your trailer, the condition of your tires, and whether 
            or not you bring a tarp or have sides you can put on your trailer (to contain 
            loose materials.) Low-pressure tires carry less and could be potentially dangerous.
          </p>

          <div class="loading-category">
            <div class="coverage-subtitle">AXLES & WEIGHT</div>
            <p>
              Typical trailer axles are rated to carry about 3,500 lbs per axle (7,000 lbs 
              total for trailers with two axles, also called dual axle or tandem axle.)
            </p>
            <p>
              Check the weights section above to find out how heavy the material is that 
              you want to load onto your trailer.
            </p>
          </div>

          <div class="loading-category">
            <div class="coverage-subtitle">TARPS & SIDES</div>
            <p>
              Please bring a tarp with straps OR put sides on your trailer when you buy our 
              bulk materials. This will help ensure you don't lose product while driving down 
              the road, potentially causing harm to other drivers!
            </p>
            
            <p class="loading-warning">
              <strong>
                We cannot be responsible for material lost during transport. To promote safety for all drivers on the road, please secure your load by using a tarp or trailer sides before leaving.
              </strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
});

export default HelpCenter;

export const head: DocumentHead = {
  title: 'Help Center',
  meta: [
    {
      name: 'description',
      content: 'Find answers to frequently asked questions, coverage charts, and loading information.',
    },
  ],
};
