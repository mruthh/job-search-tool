import React from 'react';


const OptionsBar = (props) => {

  const zipcodeInput =
    <p className="small">
      Select a Durham zip code
  <select className="form-control form-control-sm custom-select d-inline size-1 w-25 m-2"
        value={props.city}
        onChange={(e) => { props.onInputChange(e, 'city') }}>
        <option value="27701">27701</option>
        <option value="27702">27702</option>
        <option value="27703">27703</option>
        <option value="27704">27704</option>
        <option value="27705">27705</option>
        <option value="27706">27706</option>
        <option value="27707">27707</option>
        <option value="27708">27708</option>
        <option value="27709">27709</option>
        <option value="27710">27710</option>
        <option value="27711">27711</option>
        <option value="27712">27712</option>
        <option value="27713">27713</option>
        <option value="27715">27715</option>
        <option value="27717">27717</option>
        <option value="27722">27722</option>
      </select>
    </p>;

  return (
    <div className="row options-bar">
      <div className="col-md-4 text-right">
        <p>
          Find jobs within
          <input type="number" className="form-control d-inline w-25 m-2"
            value={props.radius}
            onChange={(e) => { props.onInputChange(e, 'radius') }}>
          </input>
          miles of
          <select className="form-control custom-select d-inline size-1 w-25 m-2"
            value={props.city}
            onChange={(e) => { props.onInputChange(e, 'city') }}>
            <option value="chapelhill">Chapel Hill</option>
            <option value="durham">Durham</option>
          </select>
        </p>
      {props.city !== 'chapelhill' ? zipcodeInput : null}
      </div>
      <div className="col-md-4 text-center">
        <p>
          Fetch
          <select className="form-control custom-select size-1 w-25 m-2"
            value={props.numResults}
            onChange={(e) => { props.onInputChange(e, 'numResults') }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
          results at a time
          </p>
      </div>
      <div className="col-md-4 text-left">
        <button
          className="btn btn-lg btn-primary m-2"
          onClick={props.fetchJobs}
        >
          Fetch Jobs
        </button>
      </div>
    </div>
  );
}


export default OptionsBar;
