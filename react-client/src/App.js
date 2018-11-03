import React, { Component } from 'react';
import './App.css';
import JobList from './JobList';
import request from 'request';

const baseUrl = 'http://localhost:8001'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    }
    this.fetchJobs = this.fetchJobs.bind(this);
  }
  fetchJobs() {
    console.log(`fetching from ${baseUrl}/api/jobs/snag`);
    request(`${baseUrl}/api/jobs/snag`, (err, res, body) => {
      this.setState({ jobs: JSON.parse(body) });
    });
  }

  render() {
    return (
      <div>
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
          <JobList jobs={this.state.jobs} />
        </div>
      </div>
    );
  }
}

export default App;
