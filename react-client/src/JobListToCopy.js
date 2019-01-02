import React, { Component } from 'react';

class JobListToCopy extends Component {
  constructor(props){
    super(props);
    this.table = React.createRef();
  }
  componentDidMount(){
    console.log(this.table)
    this.table.current.select();
    this.table.current.focus();
  }

  render() { 
    const jobItems = this.props.jobs.map((job) => {
      if (job.hidden) return null;
      if (!job.selected) return null;
      return (
        <tr key={job.jobUrl}>
          <td><a href={job.jobUrl}>{job.jobTitle}</a></td>
          <td>{job.companyName}</td>
          <td>{job.jobType}</td>
          <td>{job.pay}</td>
          <td>{job.postedDate}</td>
          <td>{job.industries}</td>
          <td>{job.requirements}</td>
          <td>{job.cefConnections}</td>
        </tr>
      );
    });

    return (
      <div>
        <table className={"table table-bordered table-striped w-100"}>
          <tbody ref={this.table}>
            {jobItems}
          </tbody>
        </table>
      </div>
    );
  }
};

export default JobListToCopy;