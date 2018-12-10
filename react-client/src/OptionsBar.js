import React from 'react';


const OptionsBar = (props) => {
  return (
    <div className="row">
      <div className="col-md-12 text-center">
        <p>
          Fetch
          <select className="form-control custom-select size-1 w-25 m-2"
            value={props.numResults}
            onChange={props.onNumResultsChange}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
          results at a time

        <button
            className="btn btn-lg btn-primary m-2"
            onClick={props.fetchJobs}
          >
            Fetch Jobs
        </button>
        </p>
      </div>
    </div>
  );
}


export default OptionsBar;
