const EthiopianFlag = ({ width = '100%', className = '' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 200" 
        width={width}
        aria-labelledby="title desc"
        role="img"
      >
        <title id="title">Ethiopian Flag</title>
        <desc id="desc">Flag of Ethiopia with green, yellow, and red stripes, and a central blue disc with a yellow pentagram and rays.</desc>

        {/* Green Stripe (Top) */}
        <rect x="0" y="0" width="300" height="66.67" fill="#078902" /> {/* Official Green */}

        {/* Yellow Stripe (Middle) */}
        <rect x="0" y="66.67" width="300" height="66.67" fill="#FDD216" /> {/* Official Yellow */}

        {/* Red Stripe (Bottom) */}
        <rect x="0" y="133.34" width="300" height="66.66" fill="#E4002B" /> {/* Official Red */}

        {/* Blue Disc */}
        <circle cx="150" cy="100" r="40" fill="#002169" /> {/* Official Blue */}

        {/* Star (Pentagram) */}
        {/* Points for a 5-point star centered at 150,100 with outer radius ~30, inner ~12 */}
        <polygon
          fill="#FDD216" // Yellow for the star
          points="150,70 157,87 175,87 160,99 165,117 150,108 135,117 140,99 125,87 143,87"
        />

        {/* Rays - Connecting center to outer star points */}
        {/* Using strokeWidth to give them a ray-like appearance */}
        <line x1="150" y1="100" x2="150" y2="70" stroke="#FDD216" strokeWidth="3" />
        <line x1="150" y1="100" x2="175" y2="87" stroke="#FDD216" strokeWidth="3" />
        <line x1="150" y1="100" x2="165" y2="117" stroke="#FDD216" strokeWidth="3" />
        <line x1="150" y1="100" x2="135" y2="117" stroke="#FDD216" strokeWidth="3" />
        <line x1="150" y1="100" x2="125" y2="87" stroke="#FDD216" strokeWidth="3" />
      </svg>
    </div>
  );
};

export default EthiopianFlag;
