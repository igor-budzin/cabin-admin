import React from 'react';
import PropTypes from 'prop-types';

const CollectionSection = props => {
  const { title, subtitle, cover } = props;

  return (
    <div className="section collection">
      <div className="layer">
        <div className="play-btn"></div>
      </div>
      <div className="cover">
        <img src={cover ? cover : "http://localhost:8080/api/image/collection1.jpg" } />
      </div>
      <div className="description">
        <span className="label">{title ? title : 'Краще від'}</span><br />
        <span className="label2">{subtitle}</span>
      </div>
    </div>
  );
}

export default CollectionSection;

CollectionSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired
};