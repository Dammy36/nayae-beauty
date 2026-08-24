import Hero from "../components/home/Hero.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import FeaturedServices from "../components/home/FeaturedServices.jsx";
import AboutTeaser from "../components/home/AboutTeaser.jsx";
import WhatsAppBanner from "../components/home/WhatsAppBanner.jsx";

function Home() {
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
