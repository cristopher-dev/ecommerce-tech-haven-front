import React from "react";

const Features: React.FC = () => {
  const features = [
    { icon: "bi-truck", title: "Free Shipping", desc: "On orders over $50" },
    {
      icon: "bi-shield-check",
      title: "Money Back Guarantee",
      desc: "30 days return policy",
    },
    {
      icon: "bi-headset",
      title: "Online Support",
      desc: "24/7 customer service",
    },
    {
      icon: "bi-lock",
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
              <i className={`bi ${feature.icon} fs-1 mb-3`}></i>
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
