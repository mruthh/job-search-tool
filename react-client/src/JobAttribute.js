import React, { Component } from 'react';

class JobAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      text: props.jobAttr,
    }
    this.onEditStart = this.onEditStart.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onCancelEdit = this.onCancelEdit.bind(this);
    this.handleEditJob = this.props.handleEditJob.bind(this);
    this.textarea = React.createRef();
  }
  componentDidUpdate(){
    //if we're in edit mode, focus on textarea
    if (this.state.editing) this.textarea.current.focus();
  }
  onCancelEdit(){
    this.setState({
      editing: false,
      text: this.props.jobAttr,
    });
  }
  onEditStart() {
    this.setState({ editing: true });

  }
  handleInput(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    if (this.state.editing) {
      return (
        <td>
          <textarea
            className="w-100"
            ref={this.textarea}
            value={this.state.text}
            onChange={this.handleInput}
          >
          </textarea>
         <p> 
          <button
            className="btn btn-sm btn-light"
            onClick={this.onCancelEdit}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              this.handleEditJob(this.state.text);
              this.setState({editing: false})
            }}
          >
            Update
          </button>
          </p>
          

        </td>
      );
    } else {
      return (
        <td onClick={this.onEditStart}>
          {this.state.text}
        </td>
      );
    }
  }
}

export default JobAttribute;