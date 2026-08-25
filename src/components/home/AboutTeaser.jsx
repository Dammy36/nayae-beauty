import { Link } from "react-router-dom";

// Simple centered banner, matching the About page's own title treatment
// (same blush background, centered bold heading) - a teaser pointing to
// the full story on /about.
function AboutTeaser() {
  return (
    <section className="about-title about-teaser">
      <div className="container about-teaser__inner">
        <span className="label">About</span>
        <h2>Beauty that feels like you.</h2>
        <p>
          Nayaé Beauty offers a curated selection of makeup essentials alongside professional
          beauty services, all in one place. Whether you're shopping for your everyday routine or
          booking a look for a special occasion, our goal is simple: help you feel confident in
          your own skin.
        </p>
        <Link to="/about" className="btn btn-primary">
          Learn More
        </Link>
      </div>
    </section>
  );
}

export default AboutTeaser;
