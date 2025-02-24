import React from 'react';

const ReviewItem = ({ reviewer, time, comment, avatar }) => (
  <div className="anime__review__item">
    <div className="anime__review__item__pic">
      <img src={avatar} alt="comment" />
    </div>
    <div className="anime__review__item__text">
      <h6>{reviewer} - <span>{time}</span></h6>
      <p>{comment}</p>
    </div>
  </div>
);

const Review = () => {
  const reviews = [
    {
      reviewer: "Chris Curry",
      time: "1 Hour ago",
      comment: "Just noticed that someone categorized this as belonging to the genre 'demons' LOL",
      avatar: "/assets/img/anime/review-1.jpg",
    },
    {
      reviewer: "Lewis Mann",
      time: "5 Hours ago",
      comment: "Finally it came out ages ago",
      avatar: "/assets/img/anime/review-2.jpg",
    },
    {
      reviewer: "Louis Tyler",
      time: "20 Hours ago",
      comment: "Where is the episode 15? Slow update! Tch",
      avatar: "/assets/img/anime/review-3.jpg",
    },
    // Thêm nhiều review nếu cần
  ];

  return (
    <div className="anime__details__review">
      <div className="section-title">
        <h5>Reviews</h5>
      </div>
      {reviews.map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}
    </div>
  );
};

export default Review;
