import React from 'react';


const OptionsBar = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <p>
          Fetch newest  
          <select className="m-1"
            value={props.numResults}
            onChange={props.onNumResultsChange}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
           results
        </p>
      </div>
    </div>
  );
}


export default OptionsBar;
