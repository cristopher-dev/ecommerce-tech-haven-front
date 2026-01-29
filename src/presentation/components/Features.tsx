import React from "react";

const Features: React.FC = () => {
  const features = [
    {
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      title: "Money Back Guarantee",
      desc: "30 days return policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      title: "Online Support",
      desc: "24/7 customer service",
    },
    {
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
      title: "Secure Payment",
      desc: "100% secure transactions",
    },
  ];

  return (
    <section className="py-5 bg-primary text-white">
      <div className="container">
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-3 text-center mb-4">
              <img
                src={feature.image}
                alt={feature.title}
                className="mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <h5>{feature.title}</h5>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
