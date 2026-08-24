import { Link } from "react-router-dom";

// Generic, non-specific copy only - no invented dates, client counts, or
// claims. Replace with the real brand story once the client provides it.
function AboutTeaser() {
  return (
    <section className="section about-teaser">
      <div className="container about-teaser__inner">
        <span className="label">About Nayaé Beauty</span>
        <h2>A beauty studio and shop</h2>
        <p>
          Nayaé Beauty offers a curated selection of makeup essentials alongside professional
          beauty services, all in one place.
        </p>
        <Link to="/about" className="btn btn-ghost">
          Learn More
        </Link>
      </div>
    </section>
  );
}

export default AboutTeaser;
