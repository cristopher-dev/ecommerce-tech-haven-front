import React from "react";

const Features: React.FC = () => {
  const features = [
    {
      image: "https://picsum.photos/100/100?random=shipping",
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      image: "https://picsum.photos/100/100?random=guarantee",
      title: "Money Back Guarantee",
      desc: "30 days return policy",
    },
    {
      image: "https://picsum.photos/100/100?random=support",
      title: "Online Support",
      desc: "24/7 customer service",
    },
    {
      image: "https://picsum.photos/100/100?random=payment",
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
