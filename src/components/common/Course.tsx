import React from 'react';

interface CourseProps {
  imageUrl: string;
  title: string;
  description: string;
  altText?: string;
}

const Course: React.FC<CourseProps> = ({ imageUrl, title, description, altText }) => {
  return (
    <div className="course-card">
      <div className="course-image">
        <img src={imageUrl} alt={altText || title} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="course-button">Học ngay</button>
    </div>
  );
};

export default Course;
