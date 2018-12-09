import React from 'react';
import JobAttribute from './JobAttribute';

const JobList = (props) => {

  const jobItems = props.jobs.map( (job, index) => {
    return (
        <tr key={index}>
          <td><a href={job.jobUrl}>{job.jobTitle}</a></td>
          <JobAttribute
            jobAttr={job.companyName}
            handleEditJob={(value) => 
              {props.handleEditJob(job.jobUrl, {companyName: value})}}
          >
            
          </JobAttribute>
          <td>{job.jobType}</td>
          <td>{job.location}</td>
          <td>{job.postedDate}</td>
          <td>{job.industries}</td>
          <td>{job.pay}</td>
        </tr>
    );
  });

  const renderEmptyView = () => {
    return <tr><td colSpan={7}>No jobs found...</td></tr>
  }
  return (
    <div className={"table-responsive"}>
      <table className={"table table-bordered table-striped w-100"}>
          <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Job Type (FT/PT)</th>
            <th>Location</th>
            <th>Date Posted</th>
            <th>Industries</th>
            <th>Pay</th>
          </tr>
          </thead>
        <tbody>
          {props.jobs.length ? jobItems : renderEmptyView()}
        </tbody>
      </table>
    </div>
  );
}

export default JobList;