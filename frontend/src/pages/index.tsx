// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>SPEED</title>
        <meta name="description" content="Software Practice Empirical Evidence Database" />
      </Head>

      <main>
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="title">
              Software Practice Empirical Evidence Database (SPEED)
            </h1>
            <p className="subtitle">
              A comprehensive database of empirical evidence for software engineering practices
            </p>
            <div className="hero-buttons">
              <Link href="/articles">
                <a className="btn btn-primary">Browse Articles</a>
              </Link>
              <Link href="/search">
                <a className="btn btn-secondary">Search Evidence</a>
              </Link>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Comprehensive Database</h3>
            <p>
              Access a vast collection of peer-reviewed articles on software engineering practices
            </p>
          </div>
          <div className="feature-card">
            <h3>Evidence-Based</h3>
            <p>
              All entries are backed by empirical research and real-world case studies
            </p>
          </div>
          <div className="feature-card">
            <h3>Community Driven</h3>
            <p>
              Contribute your own findings and help expand our knowledge base
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          border-radius: var(--border-radius-lg);
          margin: 2rem 0;
          box-shadow: var(--shadow-lg);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary {
          background-color: white;
          color: var(--primary-600);
        }

        .btn-primary:hover {
          background-color: var(--neutral-100);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .btn-secondary {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .features-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .feature-card h3 {
          margin-top: 0;
          color: var(--primary-600);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
