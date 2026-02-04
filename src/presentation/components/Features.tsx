import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/Features.scss';

interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
}

const Features = () => {
  const { t } = useTranslation();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'shipping',
      icon: '🚚',
      title: t('features.freeShippingTitle'),
      desc: t('features.freeShippingDesc'),
      color: '#0066ff',
    },
    {
      id: 'money-back',
      icon: '💰',
      title: t('features.moneyBackTitle'),
      desc: t('features.moneyBackDesc'),
      color: '#10b981',
    },
    {
      id: 'support',
      icon: '💬',
      title: t('features.supportTitle'),
      desc: t('features.supportDesc'),
      color: '#f59e0b',
    },
    {
      id: 'secure',
      icon: '🔒',
      title: t('features.secureTitle'),
      desc: t('features.secureDesc'),
      color: '#ef4444',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-item">
              <button
                type="button"
                className={`feature-card ${hoveredFeature === feature.id ? 'active' : ''}`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => setHoveredFeature(hoveredFeature === feature.id ? null : feature.id)}
                style={
                  {
                    '--feature-color': feature.color,
                  } as unknown as Record<string, string>
                }
                aria-pressed={hoveredFeature === feature.id}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h5 className="feature-title">{feature.title}</h5>
                <p className="feature-desc">{feature.desc}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
