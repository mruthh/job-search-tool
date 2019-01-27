import React, { Component } from 'react';
import JobList from './JobList';
import OptionsBar from './OptionsBar';
import PageNav from './PageNav';
import CopyBar from './CopyBar';
import ExportModal from './ExportModal';
import JobListToCopy from './JobListToCopy';
import request from 'request';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : 'https://arcane-brushlands-40960.herokuapp.com';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      numResults: 25,
      startIndex: 0,
      loading: true,
      showModal: false
    }
    this.fetchJobs = this.fetchJobs.bind(this);
    this.onNumResultsChange = this.onNumResultsChange.bind(this);
    this.handleEditJob = this.handleEditJob.bind(this);
    this.handlePageNavigation = this.handlePageNavigation.bind(this);
    this.handleEditJob = this.handleEditJob.bind(this);
    this.handleSelectJob = this.handleSelectJob.bind(this);
    this.handleRemoveJob = this.handleRemoveJob.bind(this);
    this.setShowModal = this.setShowModal.bind(this);
    this.handleDismissModal = this.handleDismissModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.resetPage = this.resetPage.bind(this);
  }
  fetchJobs() {
    const reqOptions = {
      uri: '/api/jobs',
      baseUrl: baseUrl,
      qs: {
        numResults: this.state.numResults,
        startIndex: this.state.startIndex,
      },
      json: true,
    };
    console.log(`fetching from ${baseUrl}/api/jobs`);
    this.setState({ loading: true });
    request(reqOptions, (err, res, body) => {
      this.setState({ loading: false });
      if (err) console.error(err);
      if (!body || body.length === 0) {
        console.error('No jobs turned from server');
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

  setShowModal(showModal){
    this.setState({showModal})
  }

  handleDismissModal(){
    this.setState({showModal: false})
  }

  handleShowModal(){
    this.setState({showModal: true});
  }

  onNumResultsChange(event) {
    this.setState({ numResults: parseInt(event.target.value) });
  }
  componentDidMount() {
    this.fetchJobs();
  }

  resetPage(){
    this.setState({
      jobs: [],
      numResults: 25,
      startIndex: 0,
      loading: true,
      showModal: false
    }, this.fetchJobs);
  }

  render() {
    console.log(this.state.jobs[0]);
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
            numResults={this.state.numResults}
            onNumResultsChange={this.onNumResultsChange}
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
            showModal={this.handleShowModal}
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
      </div>);

    const modal =
      (<div key="modal">
        <ExportModal
          showModal={this.state.showModal}
          jobs={this.state.jobs}
          dismissModal={this.handleDismissModal}
        />
      </div>);

      const jobListToCopy = (
        <div key="jobsCopy">
          <JobListToCopy 
            jobs={this.state.jobs}
            handleDismissModal={this.handleDismissModal}
            ref={this.selectedJobs}
          />
        </div>
      );
      if (this.state.loading) return [header, spinner];
      if (this.state.showModal) return [header, modal];
      return [header, body];
  }
}

export default App;
