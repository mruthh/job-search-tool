import React, { Component } from 'react';
import JobList from './JobList';
import OptionsBar from './OptionsBar';
import PageNav from './PageNav';
import request from 'request';
import 'bootstrap/dist/css/bootstrap.css';

const baseUrl = process.env.PORT || 'http://localhost:8001';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      numResults: 25,
      startIndex: 0,
      loading: true,
    }
    this.fetchJobs = this.fetchJobs.bind(this);
    this.onNumResultsChange = this.onNumResultsChange.bind(this);
    this.handlePageNavigation = this.handlePageNavigation.bind(this);
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
      console.log(body);

      if (body.length === 0) {

      } else {
        try {
          this.setState({ jobs: body });
        } catch (e) {
          console.error(e);
        }
      }
    });
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

  onNumResultsChange(event) {
    this.setState({ numResults: parseInt(event.target.value) });
  }
  componentDidMount() {
    this.fetchJobs();
  }

  render() {

    const header = (
      <div key="header">
        <div className="App">
          <header className="App-header">
            <p>
              Let's search some jobs, ok?
          </p>
            <p>
              <button onClick={this.fetchJobs}>Snag 'em</button>
            </p>
          </header>
        </div>
        <div>
          <OptionsBar
            numResults={this.state.numResults}
            onNumResultsChange={this.onNumResultsChange}
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

    const navAndJobList = (
      <div key="navAndJobList">
        <div>
          <PageNav
            startIndex={this.state.startIndex}
            listLength={this.state.jobs.length}
            handlePageNavigation={this.handlePageNavigation}
          />
        </div>
        <div>
          <JobList jobs={this.state.jobs} />
        </div>
      </div>);

    return this.state.loading ? [header, spinner] : [header, navAndJobList];
  }
}

export default App;
