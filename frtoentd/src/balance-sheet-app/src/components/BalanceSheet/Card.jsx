import React from 'react';
import './styles.css';

const Card = ({ title, value, bgColor, textColor }) => {
  return (
    <div className={`card ${bgColor} ${textColor} shadow-lg transform transition-transform duration-300 hover:scale-105`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

export default Card;