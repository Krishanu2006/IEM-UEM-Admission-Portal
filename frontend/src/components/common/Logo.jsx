import { Link } from "react-router-dom";


export default function Logo() {
  return (
    <a href="/" className="brand-logo" aria-label="IEM home">
      <img
        src="/images/iem-logo.png"
        alt="Institute of Engineering & Management — Good Education, Good Jobs"
        className="brand-logo-image"
      />
    </a>
  );
}
