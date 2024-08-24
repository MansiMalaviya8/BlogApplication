import React from 'react';
import styled from 'styled-components';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const FooterWrapper = styled.footer`
    background-color: #000;
    color: #fff;
    padding: 20px 0;

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        
    }

    .social-icons {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
    }

    .social-icons a {
        color: #fff;
        font-size: 1.5rem;
        transition: color 0.3s ease;
    }

    .social-icons a:hover {
        color: #3498db;
    }

    .nav-links {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
    }

    .nav-links a {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        transition: color 0.3s ease;
    }

    .nav-links a:hover {
        color: #3498db;
    }

    .copyright {
        font-size: 0.9rem;
        margin-top: 15px;
    }
`;

const Footer = () => {
    return (
        <FooterWrapper>
            <div className="container">
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <Twitter />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram />
                    </a>
                </div>
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                </div>
                <div className="copyright">
                    &copy; {new Date().getFullYear()} MyBlog. All Rights Reserved.
                </div>
            </div>
        </FooterWrapper>
    );
};

export default Footer;
