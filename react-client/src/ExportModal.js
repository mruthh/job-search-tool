import React, { Component } from 'react';

class ExportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {copied: false}
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.copyText = React.createRef();
  }

  componentDidMount() {
    if (this.props.showModal) {

      this.copyText.current.select();
      this.copyText.current.focus();
    }

  }

  copyToClipboard() {
    this.copyText.current.select();
    document.execCommand('copy');
    this.setState({copied: true})
  }

  doNothing() {
    //getcher onchange handler here
  }
  render() {
    if (!this.props.showModal) return null;

    const fields = ['jobTitle', 'jobUrl', 'companyName', 'jobType', 'pay', 'location', 'postedDate', 'industries', 'requirements', 'cefConnections'];

    const copyString = this.props.jobs.reduce((string, job) => {
      if (!job.selected) return string;

      let serialized = '';
      fields.forEach((field) => {
        serialized += job[field];
        serialized += '\t';
      });
      //replace final tab with a newline
      serialized = serialized.slice(0, -1).replace(/\n/g, ' ') + '\n';
      return string + serialized;
    }, '');

    return (
      <div>
        <div className="row w-100">
          <div className="col-md-12 text-center">
          <button
              className="btn btn-default ml-5 mr-5"
              onClick={this.props.dismissModal}
            >
            Back to Job List
            </button>
            <button
              className="btn btn-info ml-5 mr-5"
              onClick={this.copyToClipboard}
              disabled={this.setState.copied}
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="row w-100">
            <div className="col-md-12 w-100 p-5">
              <textarea readOnly
                ref={this.copyText}
                className={this.state.copied ? "form-control align-center text-center w-100" : "form-control align-center w-100"}
                rows="25"
                value={this.state.copied ? 'Copied!' : copyString}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ExportModal;
