import React, { useEffect } from 'react';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Form from './Form';

const PageAdmin = () => {
  useEffect(() => {
    // Collapse Navbar
    const navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  }, []);
  return (
    <>
      <Navbar />
      <section className="bg-gradient page-section profile-section">
        <div className="container">
          <div className="row">
            <Form />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PageAdmin;
