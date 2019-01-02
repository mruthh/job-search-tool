import React from 'react';

const CopyBar = (props) => {
  //count selected jobs
  const numSelected = props.jobs.reduce((num, job) => {
    return job.selected ? num + 1 : num;
  }, 0);
  console.log('numSelected =' + numSelected);
  if (numSelected === 0) return null;
  console.log('didn\'t return null')
  return (
    <div className="row">
      <div className="col-md-12">
        <p>{numSelected} jobs selected
        <button
          className="btn btn-block btn-info"
          onClick={props.showModal}
        >
        Export Selected Jobs</button>
        </p>
      </div>
    </div>
  );
}

export default CopyBar;