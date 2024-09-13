"use client";

import React, { useState, useEffect } from "react";
import testimonials from "@/data/testimonials";
import styles from "./Testimonials.module.css";
import TestimonialCard from "./TestimonialCard";

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 12000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage;
    return testimonials.slice(start, start + testimonialsPerPage);
  };

  return (
    <div className={styles.testimonialContainer}>
      <div
        className={styles.testimonialWrapper}
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div key={pageIndex} className={styles.testimonialPage}>
            {testimonials
              .slice(
                pageIndex * testimonialsPerPage,
                (pageIndex + 1) * testimonialsPerPage
              )
              .map((testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  heading={testimonial.heading}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  image={testimonial.image}
                />
              ))}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              currentPage === index ? styles.active : ""
            }`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
