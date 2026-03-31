import React from 'react';
import './PageHeader.css';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <div className="page-header-bg"></div>
      <div className="container">
        <div className="page-header-content">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;