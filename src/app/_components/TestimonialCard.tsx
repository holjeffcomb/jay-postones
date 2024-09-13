import React from "react";
import Image from "next/image";
import styles from "./TestimonialCard.module.css";

interface TestimonialCardProps {
  heading: string;
  quote: string;
  name: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  heading,
  quote,
  name,
  image,
}) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.headingContainer} flex items-center`}>
        <h2 className={`${styles.heading} uppercase font-bold`}>
          {heading.toUpperCase()}
        </h2>
      </div>
      <Image src="/images/icons/quote.png" alt="quote" width={25} height={25} />
      <p className={styles.quote}>
        {quote.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < quote.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
      <div className={styles.footer}>
        <div className={styles.nameContainer}>
          <p className={styles.name}>{name}</p>
          <p className={styles.subText}>Masterclass Student</p>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={`/images/testimonials/${image}`}
            alt={name}
            width={100}
            height={100}
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
