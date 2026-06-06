import ScrollReveal from "@/components/ui/ScrollReveal";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "200+", label: "Designs Created" },
  { value: "150+", label: "Graduates" },
  { value: "5+", label: "Years of Excellence" },
];

export default function StatsSection() {
  return (
    <section style={{ backgroundColor: "#FAF7F4", borderTop: "1px solid #f0ebe3", borderBottom: "1px solid #f0ebe3" }}>
      <style>{`
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 0; 
        }
        @media(min-width: 768px) { 
          .stats-grid { grid-template-columns: repeat(4, 1fr); } 
        }
        
        .stat-item {
          text-align: center;
          padding: 3rem 1rem;
          border-bottom: 1px solid #f0ebe3;
          transition: all 0.4s ease;
          position: relative;
          cursor: default;
          background-color: transparent;
        }
        @media(min-width: 768px) {
          .stat-item { 
            border-bottom: none; 
            border-right: 1px solid #f0ebe3; 
          }
        }
        .stat-item:last-child { 
          border-right: none; 
        }

        /* Hover Effects */
        .stat-item:hover {
          transform: translateY(-8px);
          background-color: white;
          box-shadow: 0 15px 35px rgba(0,0,0,0.04);
          z-index: 10;
          border-color: transparent;
          border-radius: 4px;
        }

        .stat-value {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: #C9A84C;
          line-height: 1;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .stat-item:hover .stat-value {
          text-shadow: 0 4px 15px rgba(201, 168, 76, 0.4);
          transform: scale(1.05);
        }

        .stat-label {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .stat-item:hover .stat-label {
          color: #1a1a1a;
        }
      `}</style>
      
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100} direction="up">
              <div className="stat-item">
                <p className="stat-value">
                  {stat.value}
                </p>
                <p className="stat-label">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}