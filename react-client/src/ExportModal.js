import React, { Component } from 'react';

class ExportModal extends Component {
  constructor(props) {
    super(props);
    this.copyText = React.createRef();
  }

  componentDidMount(){
    if (this.props.showModal) {

      this.copyText.current.select();
      this.copyText.current.focus();
    }
    
  }

  doNothing(){
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
      <div className="row w-100">
        <div className="col-md-12 w-100 p-5">
          <textarea onChange={this.doNothing}
            ref={this.copyText}
            className="form-control align-center w-100"
            rows="25"
            value={copyString}
          >
          </textarea>
        </div>
      </div>
    );
  }
  // return (
  //   <div className="modal" role="dialog">
  //     <div className="modal-dialog" role="document">
  //       <div className="modal-content">
  //         <div className="modal-header">
  //           <h5 className="modal-title">Modal title</h5>
  //           <button
  //             className="close" 
  //             data-dismiss="modal" 
  //             aria-label="Close"
  //             onClick={this.props.dismissModal}
  //             >
  //             <span aria-hidden="true">{'\u2715'}</span>
  //           </button>
  //         </div>
  //         <div className="modal-body">
  //           <p>{copyString}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ExportModal;
