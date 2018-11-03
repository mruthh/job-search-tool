import React from 'react';

const JobList = (props) => {

  const jobItems = props.jobs.map(job => {
    return (
    <li key={job.jobUrl}>
      <div>
        <dl>
          <dt>Title</dt>
          <dd>{job.jobTitle}</dd>
          <dt>Company</dt>
          <dd>{job.companyName}</dd>
          <dt>Job Type (FT/PT)</dt>
          <dd>{job.jobType}</dd>
          <dt>Location</dt>
          <dd>{job.location}</dd>
          <dt>Date posted</dt>
          <dd>{job.postedDate}</dd>
          <dt>Industries</dt>
          <dd>{job.industries}</dd>
          <dt>Pay</dt>
          <dd>{job.pay}</dd>
        </dl>
      </div>
    </li>
    );
  });
  
  const renderEmptyView = () => {
    return <p>No jobs yet!</p>
  }
  return (
    <ul>
      {props.jobs.length ? jobItems : renderEmptyView()}
    </ul>
  );
}

export default JobList;