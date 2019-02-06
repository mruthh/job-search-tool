import React, { Component } from 'react';

class ExportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {copied: false}
    this.copyToClipboard = this.copyToClipboard.bind(this);
    // this.copyText = React.createRef();
  }

  componentDidMount() {
    if (this.props.showModal) {
      // console.log(this.copyText);
      // console.log(this.copyText.current);
      // this.copyText.current.select();
      // this.copyText.current.focus();
    }

  }

  copyToClipboard() {
    // this.copyText.current.select();
    const copyString = this.makeCopyString_HTML();
    // const clipEvent = new ClipboardEvent('copy', copyString);
    // // document.execCommand('copy');
    // clipEvent.copy();
    function setClipboardData(e){
      e.clipboardData.setData("text/html", copyString);
      e.preventDefault();
    }
    document.addEventListener("copy", setClipboardData);
    document.execCommand("copy");
    document.removeEventListener("copy", setClipboardData);

    this.setState({copied: true})
  }

  doNothing() {
    //getcher onchange handler here
  }

  makeCopyString_HTML(){
    const fields = ['companyName', 'jobType', 'pay', 'location', 'postedDate', 'industries', 'requirements', 'cefConnections'];

    const rows = this.props.jobs.filter(job => job.selected)
      .map((job) => {
      let row = `<td><a href=${job.jobUrl}>${job.jobTitle}</a></td>`;
      fields.forEach((field) => {
        row += `<td>${job[field]}</td>`;
      });
      return row;
    });
    
    return `<table>${rows}</table>`;
  }
  makeCopyString_richText(){
    const fields = ['companyName', 'jobType', 'pay', 'location', 'postedDate', 'industries', 'requirements', 'cefConnections'];

    return this.props.jobs.reduce((string, job) => {
      if (!job.selected) return string;

      let serialized = `<a href="${job.jobUrl}">${job.jobTitle}</a>\t`;

      fields.forEach((field) => {
        serialized += job[field];
        serialized += '\t';
      });
      //replace final tab with a newline
      // serialized = serialized.slice(0, -1).replace(/\n/g, ' ') + '\n';
      return string + serialized;
    }, '');
  }
  makeCopyString_plainText(){
    if (!this.props.showModal) return null;

    const fields = ['jobTitle', 'jobUrl', 'companyName', 'jobType', 'pay', 'location', 'postedDate', 'industries', 'requirements', 'cefConnections'];

    return this.props.jobs.reduce((string, job) => {
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
  }
  render() {
    const copyString = this.makeCopyString_plainText();
    return (
      <div>
        <div className="row w-100">
          <div className="col-md-12 text-center">
          <button
              className="btn btn-secondary ml-5 mr-5"
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
              {/* <textarea readOnly */}
              <div
                contentEditable={!this.state.copied}
                ref={this.copyText}
                className={this.state.copied ? "form-control align-center text-center w-100" : "form-control align-center w-100"}
                rows="25"
                // value={this.state.copied ? 'Copied!' : copyString}
              >
              {this.state.copied ? 'Copied!' : copyString}
              </div>
              {/* </textarea> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ExportModal;
