import React from 'react';

const PageNav = (props) => {
  // this should say "Viewing page (e.g. 1) of results"
  // (listLength results found)
  const pageNum = props.startIndex + 1;

  if (props.listLength === 0) return null;

  return (
    <div className="row">
      <div className="col-md-12 text-center m-3">
        <button 
          className="btn btn-secondary" 
          disabled={props.startIndex === 0}
          onClick={() => {props.handlePageNavigation(false)}}
          > Prev (newer jobs)</button>
        <span className="m-2">
          Viewing page {pageNum} of results.</span>
          <span>{props.listLength} jobs found.</span>
        
        <button 
          className="btn btn-secondary"
          onClick={() => {props.handlePageNavigation(true)}}
        > Next (older jobs)</button>
      </div>
    </div>
  );
}

export default PageNav;