import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="container contact" style={{ marginTop: "5rem" }}>
      <h1>Contact Us</h1>
      <p>
        We’d love to hear from you! If you have any questions, feedback, or suggestions, please feel free to reach out to us using the contact information below.
      </p>
      <p>
        Email: <a href="mailto:support@myblog.com">support@myblog.com</a>
      </p>
      <p>
        You can also follow us on social media for updates and more content:
      </p>
      <ul>
        <li><a href="https://twitter.com/myblog" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        <li><a href="https://facebook.com/myblog" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://instagram.com/myblog" target="_blank" rel="noopener noreferrer">Instagram</a></li>
      </ul>
    </div>
  );
};

export default Contact;
