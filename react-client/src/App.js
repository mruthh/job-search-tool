import React, { Component } from 'react';
import JobList from './JobList';
import OptionsBar from './OptionsBar';
import request from 'request';
import 'bootstrap/dist/css/bootstrap.css';

const baseUrl = process.env.PORT || 'http://localhost:8001';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      numResults: 25,
      startIndex: 0
    }
    this.fetchJobs = this.fetchJobs.bind(this);
    this.onNumResultsChange = this.onNumResultsChange.bind(this);
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
    
    request(reqOptions, (err, res, body) => {
      if (err) console.error(err);
      try {
        this.setState({jobs: body});
      } catch(e){
        console.error(e);
      }
    });
  }

  onNumResultsChange(event){
    this.setState({numResults: event.target.value});
  }
  componentDidMount(){
    this.fetchJobs();
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
          <OptionsBar> 
            numResults={this.state.numResults} 
            onNumResultsChange={this.onNumResultsChange}
          </OptionsBar>
        </div>
        <div>
          <JobList jobs={this.state.jobs} />
        </div>
      </div>
    );
  }
}

export default App;
