import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

export default function Rating({ rating }) {
  return (
    <div className="flex">
      {rating >= 1 ? (
        <AiFillStar className="text-yellow-500 scale-125" />
      ) : (
        <AiOutlineStar className="text-yellow-500 scale-125" />
      )}
      {rating >= 2 ? (
        <AiFillStar className="text-yellow-500 scale-125" />
      ) : (
        <AiOutlineStar className="text-yellow-500 scale-125" />
      )}
      {rating >= 3 ? (
        <AiFillStar className="text-yellow-500 scale-125" />
      ) : (
        <AiOutlineStar className="text-yellow-500 scale-125" />
      )}
      {rating >= 4 ? (
        <AiFillStar className="text-yellow-500 scale-125" />
      ) : (
        <AiOutlineStar className="text-yellow-500 scale-125" />
      )}
      {rating >= 5 ? (
        <AiFillStar className="text-yellow-500 scale-125" />
      ) : (
        <AiOutlineStar className="text-yellow-500 scale-125" />
      )}
    </div>
  );
}
