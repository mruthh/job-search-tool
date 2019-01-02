import React from 'react';
import JobAttribute from './JobAttribute';

const JobList = (props) => {

  const jobItems = props.jobs.map((job) => {
    if (job.hidden) return null;
    return (
      <tr key={job.jobUrl} className={job.selected ? 'selected' : ''}>
        <td>
        <button
            className="btn btn-sm btn-danger float-left"
            onClick={() => { props.handleRemoveJob(job.jobUrl) }}
          >
            {'\u2715'}
            </button>

          <button
            className="btn btn-sm btn-primary float-right" 
            value={job.selected}
            onClick={() => { props.handleSelectJob(job.jobUrl) }}
          >
          {'\u2713'}
          </button>

        </td>
        <td><a href={job.jobUrl}>{job.jobTitle}</a></td>
        <JobAttribute
          jobAttr={job.companyName}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { companyName: value }) }}
        />

        <JobAttribute
          jobAttr={job.jobType}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { jobType: value }) }}
        />
        <JobAttribute
          jobAttr={job.pay}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { pay: value }) }}
        />
        <JobAttribute
          jobAttr={job.location}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { location: value }) }}
        />
        <JobAttribute
          jobAttr={job.postedDate}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { postedDate: value }) }}
        />
        <JobAttribute
          jobAttr={job.industries}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { industries: value }) }}
        />
        <JobAttribute
          jobAttr={job.requirements}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { requirements: value }) }}
        />
        <JobAttribute
          jobAttr={job.cefConnections}
          handleEditJob={(value) => { props.handleEditJob(job.jobUrl, { cefConnections: value }) }}
        />
      </tr>
    );
  });

  const renderEmptyView = () => {
    return <tr><td colSpan={7}>No jobs found...</td></tr>
  }
  return (
    // <div className={"table-responsive"}>
    <div>
      <table className={"table table-bordered table-striped w-100"}>
        <thead>
          <tr>
            <th>________</th>
            <th>Title</th>
            <th>Company</th>
            <th>Job Type (FT/PT)</th>
            <th>Pay</th>
            <th>Location</th>
            <th>Date Posted</th>
            <th>Industries</th>
            <th>Requirements</th>
            <th>CEF Connections</th>
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