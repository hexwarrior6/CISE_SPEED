import React, { useState, useEffect } from "react";
import "../../styles/StarRating.scss";

interface StarRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onRatingChange,
  readonly = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value: number) => {
    if (readonly) return;
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (readonly) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const halfValue = starValue - 0.5;
    const currentValue = hoverRating || rating;

    let starClass = "star";
    if (currentValue >= starValue) {
      starClass += " full";
    } else if (currentValue >= halfValue) {
      starClass += " half";
    }

    return (
      <div
        key={index}
        className={`star-container ${readonly ? "readonly" : ""}`}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={starClass}
          onClick={() => handleClick(halfValue)}
          onMouseEnter={() => handleMouseEnter(halfValue)}
        >
          <div className="star-half left"></div>
        </div>
        <div
          className={starClass}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
        >
          <div className="star-half right"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => renderStar(i))}
    </div>
  );
};

export default StarRating;
