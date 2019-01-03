import React, { Component } from 'react';

class ExportModal extends Component {
  constructor(props) {
    super(props);
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
          <div className="col-md-12">
          <button
              className="btn btn-default"
              onClick={this.props.dismissModal}
            >
            Back to Job List
            </button>
            <button
              className="btn btn-info"
              onClick={this.copyToClipboard}
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="row w-100">
            <div className="col-md-12 w-100 p-5">
              <textarea readOnly
                ref={this.copyText}
                className="form-control align-center w-100"
                rows="25"
                value={copyString}
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
