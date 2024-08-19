"use client";

import React, { useState, useEffect } from "react";
import testimonials from "@/data/testimonials";
import styles from "./Testimonials.module.css";
import Image from "next/image";

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.testimonialContainer}>
      <div
        className={styles.testimonialWrapper}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div className={styles.testimonial} key={index}>
            <div className={styles.imageContainer}>
              <Image
                src={`/images/testimonials/${testimonial.image}`}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt={testimonial.name}
              />
            </div>
            <div className={styles.testimonialText}>
              <h2 className="font-bold">{testimonial.heading}</h2>
              <p className="font-light">{testimonial.quote}</p>
              <p className="font-normal">- {testimonial.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
