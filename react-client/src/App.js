import React, { Component } from 'react';
import JobList from './JobList';
import OptionsBar from './OptionsBar';
import PageNav from './PageNav';
import CopyBar from './CopyBar';
import request from 'request';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : 'https://arcane-brushlands-40960.herokuapp.com';

const defaultState = {
  jobs: [],
  city: 'chapelhill',
  zip: 27701,
  radius: 5,
  numResults: 25,
  startIndex: 0,
  loading: true,
  copied: false
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.fetchJobs = this.fetchJobs.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleEditJob = this.handleEditJob.bind(this);
    this.handlePageNavigation = this.handlePageNavigation.bind(this);
    this.handleEditJob = this.handleEditJob.bind(this);
    this.handleSelectJob = this.handleSelectJob.bind(this);
    this.handleRemoveJob = this.handleRemoveJob.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
    this.validateParams = this.validateParams.bind(this);
  }
  validateParams(){
    let isValid = false;
    let errors = [];
    const numVal = parseInt(this.state.radius);
    if (Number.isNaN(numVal)) {
      errors.push(`Distance from location must be a numeric value`);
      return {isValid, errors};
    }
    if (numVal < 0 || numVal > 50) {
      errors.push(`Distance from location must be between 0 and 50`);
      return {isValid, errors};
    }
    return {isValid: true, errors};
  }
  fetchJobs() {
    const reqOptions = {
      uri: '/api/jobs',
      baseUrl: baseUrl,
      qs: {
        numResults: this.state.numResults,
        startIndex: this.state.startIndex,
        city: this.state.city === 'chapelhill' ? 'chapelhill' : this.state.zip
      },
      json: true,
    };
    console.log(`fetching from ${baseUrl}/api/jobs`);
    this.setState({ loading: true, copied: false });
    request(reqOptions, (err, res, body) => {
      this.setState({ loading: false });
      if (err) console.error(err);
      if (!body || body.length === 0) {
        console.error('No jobs returned from server');
        return;
      }
      const jobs = body.map(job => this.parseJob(job));
      this.setState({ jobs });

    });
  }

  parseJob(job) {
    const formatted = { 
      ...job, 
      selected: false, 
      hidden: false,
      snag: job.jobUrl.includes('snagajob.com'),  
    };
    return formatted;
  }
  handleEditJob(jobUrl, keyValPair) {
    //takes a jobId and a keyvalpair (e.g. {companyName: 'Harris Teeter'})
    //updates the job with the given id to have the value from the keyvalpair
    
    const jobToEdit = this.state.jobs.find(job => job.jobUrl === jobUrl);
    
    if (!jobToEdit) {
      console.error(`Unable to edit job with url ${jobUrl}. Job not found.`);
      return;
    }
    //get key from keyvalpair
    const key = Object.keys(keyValPair)[0];
    //make sure key exists
    if (!(jobToEdit.hasOwnProperty(key))) {
      console.error(`Unable to update job. Key ${key} not found`);
      return;
    }
    //update value of key
    const updatedJob = { ...jobToEdit, ...keyValPair };
    const updatedJobs = this.state.jobs.map((job) => {
      return job.jobUrl === jobToEdit.jobUrl ? updatedJob : job;
    });
    this.setState({ jobs: updatedJobs });
  }

  handleRemoveJob(jobUrl){

    const jobs = [...this.state.jobs];
    const jobToHide = jobs.find(job => job.jobUrl === jobUrl);
    
    if (!jobToHide) {
      console.error(`Unable to edit job with url ${jobUrl}. Job not found.`);
      return;
    }
    //if job was selected, unselect it. set to hidden
    jobToHide.selected = false;
    jobToHide.hidden = true;

    this.setState({jobs});
  }

  handlePageNavigation(isForward) {
    //if we are moving forward, new start index is start index + numResults
    //if we are moving backward, new start index is start index - numResults

    const newStartIndex = isForward
      ? parseInt(this.state.startIndex) + parseInt(this.state.numResults)
      : parseInt(this.state.startIndex) - parseInt(this.state.numResults);

    //make sure we don't get a startIndex below 0
    if (newStartIndex >= 0) {
      this.setState({ startIndex: newStartIndex, jobs: [] });
      this.fetchJobs();
    } else {
      console.error('Cannot set start index to a negative number');
    }
  }

  handleSelectJob(jobUrl){
    const jobToEdit = this.state.jobs.find(job => job.jobUrl === jobUrl);
    if (!jobToEdit) {
      console.error(`Unable to select or unselect job with url ${jobUrl}. Job not found.`);
      return;
    }

    //toggle job's selected status
    const updatedJob = {...jobToEdit };
    updatedJob.selected = !(jobToEdit.selected);

    const updatedJobs = this.state.jobs.map((job) => {
      return job.jobUrl === jobToEdit.jobUrl ? updatedJob : job;
    });
    this.setState({jobs: updatedJobs});
  }

  onNumResultsChange(event) {
    this.setState({ numResults: parseInt(event.target.value) });
  }

  onInputChange(event, property){
    let value = event.target.value;
    if (property === 'numResults') value = parseInt(value);
    if (property === 'radius') value = parseInt(value);
    this.setState({[property]: value});
  }

  makeCopyString_HTML(){
    const fields = ['companyName', 'jobType', 'pay', 'location', 'postedDate', 'industries', 'requirements', 'cefConnections'];

    const rows = this.state.jobs.filter(job => job.selected)
      .map((job) => {
      let row = `<tr><td><a href=${job.jobUrl}>${job.jobTitle}</a></td>`;
      fields.forEach((field) => {
        row += `<td>${job[field]}</td>`;
      });
      row += '<td>';
      return row;
    }); 
    return `<table>${rows}</table>`;
  }

  onCopyToClipboard() {
    const copyString = this.makeCopyString_HTML();
    function setClipboardData(e){
      e.clipboardData.setData("text/html", copyString);
      e.preventDefault();
    }
    document.addEventListener("copy", setClipboardData);
    document.execCommand("copy");
    document.removeEventListener("copy", setClipboardData);
    this.setState({copied: true});
  }

  componentDidMount() {
    this.fetchJobs();
  }

  resetPage(){
    this.setState(defaultState, this.fetchJobs);
  }

  render() {
    const header = (
      <div key="header">
        <div className="App">
          <header className="App-header" onClick={this.resetPage}>
            <img src={require('./assets/cef-logo.png')} alt="cef-logo" />
            <h3>Job Search Tool</h3>
          </header>
        </div>
        <div>
          <OptionsBar
            city={this.state.city}
            radius={this.state.radius}
            numResults={this.state.numResults}
            onInputChange={this.onInputChange}
            validateParams={this.validateParams}
            fetchJobs={this.fetchJobs}
          />
        </div>
      </div>
    );



    const spinner = (
      <div key="spinner" className="row">
        <div className="col-md-12 text-center m-3">
          <img src={require('./assets/spinner.gif')}
            alt="loading..." />
        </div>
      </div>
    );

    const body = (
      <div key="body">
        <div>
          <PageNav
            startIndex={this.state.startIndex}
            listLength={this.state.jobs.length}
            handlePageNavigation={this.handlePageNavigation}
          />
        </div>
        <div>
          <CopyBar
            jobs={this.state.jobs}
            copyToClipboard={this.onCopyToClipboard}
            copied={this.state.copied}
          />
        </div>
        <div>
          <JobList
            jobs={this.state.jobs}
            handleEditJob={this.handleEditJob}
            handleSelectJob={this.handleSelectJob}
            handleRemoveJob={this.handleRemoveJob}
          />
        </div>
        <div>
          <PageNav
            startIndex={this.state.startIndex}
            listLength={this.state.jobs.length}
            handlePageNavigation={this.handlePageNavigation}
          />
        </div>
      </div>);

      if (this.state.loading) return [header, spinner];
      return [header, body];
  }
}

export default App;
