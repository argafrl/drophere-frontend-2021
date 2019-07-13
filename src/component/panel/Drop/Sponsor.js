import React from 'react';

import dropFileStyle from '../../../css/drop-file.module.scss';

const Sponsor = props => {
  const sponsors = [
    {
      link:'https://dhimas.tech',
      img: 'https://comeapp.id/static/app-store-badge.png'
    },
    {
      link:'https://dhimas.tech',
      img: 'https://comeapp.id/static/google-play-badge.png'
    },
    {
      link:'https://dhimas.tech',
      img: 'https://comeapp.id/static/app-store-badge.png'
    },
  ];
  const content = sponsors.map(sponsor => {
    return (
      <div className={dropFileStyle['sponsor-wrapper']}>
        <a href={sponsor.link} target="_blank" rel="noopener noreferrer"><img src={sponsor.img} alt="sponsor" style={{ maxHeight:64 }} /></a>
      </div>)
  });
  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
};

export default Sponsor;