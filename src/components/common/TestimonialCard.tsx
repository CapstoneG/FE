import React from 'react';

interface TestimonialCardProps {
  avatarUrl: string;
  name: string;
  rating: string;
  testimonial: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  avatarUrl,
  name,
  rating,
  testimonial,
}) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-avatar">
        <img src={avatarUrl} alt={name} />
      </div>
      <h4>{name}</h4>
      <div className="testimonial-rating">{rating}</div>
      <p>"{testimonial}"</p>
    </div>
  );
};
