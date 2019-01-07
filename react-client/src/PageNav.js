import React from 'react';

const PageNav = (props) => {
  //1-based numbers e.g. viewing results 1-30
  const startNum = parseInt(props.startIndex) + 1;
  const endNum = parseInt(props.startIndex) + parseInt(props.listLength);

  if (props.listLength === 0) return null;

  return (
    <div className="row">
      <div className="col-md-12 text-center m-3">
        <button 
          className="btn btn-secondary" 
          disabled={props.startIndex === 0}
          onClick={() => {props.handlePageNavigation(false)}}
          > Prev </button>
        <span className="m-2">Viewing results {startNum} - {endNum}</span>
        <button 
          className="btn btn-secondary"
          onClick={() => {props.handlePageNavigation(true)}}
        > Next </button>
      </div>
    </div>
  );
}

export default PageNav;