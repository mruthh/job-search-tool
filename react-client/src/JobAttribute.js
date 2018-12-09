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
            ref={this.textarea}
            value={this.state.text}
            onChange={this.handleInput}
            tabIndex={0}
          >
          </textarea>
          
          <button
            className="btn btn-sm btn-default"
            onClick={this.onCancelEdit}
            tabIndex={1}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              this.handleEditJob(this.state.text);
              this.setState({editing: false})
            }}
            tabIndex={2}
          >
            Update
          </button>
          

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