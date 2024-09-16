import React from 'react';
import { Link } from 'react-router-dom';

const Policy = () => {
  return (
    <div className="container privacy-policy" style={{ marginTop: "5rem" }}>
      <h1>Privacy Policy</h1>
      <p>
        At My Blog, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information. By using our website, you consent to the collection and use of information in accordance with this policy.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name and email address when you subscribe to our newsletter or contact us. We also collect information about your use of our website through cookies and analytics tools.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        We use the information to improve our services, respond to your inquiries, and send periodic updates or newsletters. We do not share your information with third parties without your consent.
      </p>
      <h2>Security</h2>
      <p>
        We implement security measures to protect your information from unauthorized access. However, no method of transmission over the internet or electronic storage is 100% secure.
      </p>
      <p>
        If you have any questions about our privacy practices, please <Link to="/contact">contact us</Link>.
      </p>
    </div>
  );
};

export default Policy;
