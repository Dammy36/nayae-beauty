import Hero from "../components/home/Hero.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import FeaturedServices from "../components/home/FeaturedServices.jsx";
import AboutTeaser from "../components/home/AboutTeaser.jsx";
import WhatsAppBanner from "../components/home/WhatsAppBanner.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

function Home() {
  usePageMeta(
    "Nayaé Beauty | Makeup Shop & Beauty Services in Canada",
    "Nayaé Beauty offers a curated selection of makeup essentials alongside professional beauty services in Canada. Shop online or book your next appointment."
  );

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <FeaturedServices />
      <div className="container">
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__ring" />
        </div>
      </div>
      <AboutTeaser />
      <WhatsAppBanner />
    </>
  );
}

export default Home;
