import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container about" style={{ marginTop: "5rem" }}>
      <h1>About Us</h1>
      <p>
        Welcome to My Blog! We are passionate about sharing insightful articles and stories with our readers. Our blog covers a wide range of topics, including technology, lifestyle, and personal development. We aim to provide valuable content that informs and inspires. Thank you for visiting and being a part of our community!
      </p>
      <p>
        If you have any questions or feedback, feel free to <Link to="/contact">contact us</Link>.
      </p>
    </div>
  );
};

export default About;
