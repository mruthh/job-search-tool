import React from 'react';

const CopyBar = (props) => {
  //count selected jobs
  const numSelected = props.jobs.reduce((num, job) => {
    return job.selected ? num + 1 : num;
  }, 0);

  if (numSelected === 0) return null;

  const buttonText = props.copied ? 'Copied!' : `Copy ${numSelected} Selected Job(s) to Clipboard`
    return (
      <div className="row">
        <div className="col-md-12">
          <p>
          <button
            className="btn btn-block btn-info"
            onClick={props.copyToClipboard}
            disabled={props.copied}
          >
          {buttonText}
          </button>
          </p>
        </div>
      </div>
    );

}

export default CopyBar;