import React from 'react';

interface BlogCardProps {
  imageUrl: string;
  title: string;
  description: string;
  altText?: string;
  link?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  imageUrl,
  title,
  description,
  altText,
  link = '#',
}) => {
  return (
    <div className="blog-card">
      <div className="blog-image">
        <img src={imageUrl} alt={altText || title} />
      </div>
      <div className="blog-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} className="blog-link">Đọc thêm</a>
      </div>
    </div>
  );
};
