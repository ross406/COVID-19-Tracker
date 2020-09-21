import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './Infobox.css';

function InfoBox({ title, cases, active, isRed, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} ${
        isRed && 'infoBox--red'
      }`}
    >
      <CardContent>
        {/* Title */}
        <Typography className='infoBox__title' color='textSecondary'>
          {title}
        </Typography>
        {/* Number of cases */}
        <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>
          {cases}
        </h2>

        {/* 1.2M total */}

        <Typography className='infoBox__total' color='textSecondary'>
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
