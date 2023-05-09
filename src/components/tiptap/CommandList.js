import React, { Component } from 'react';

class CommandList extends Component {
  state = {
    selectedIndex: 0,
  };

  componentDidUpdate(oldProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown({ event }) {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + this.props.items.length - 1) % this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index) {
    const item = this.props.items[index];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;

    if (items.length === 0) {
      return (
        <div className="tiptap-items">
          <div className="tiptap-item no-data">No match found!</div>
        </div>
      );
    }

    return (
      <div className="tiptap-items">
        {items.map((item, index) => {
          return (
            <button
              className={`tiptap-item ${index === this.state.selectedIndex ? 'is-selected' : ''}`}
              key={index}
              onClick={() => this.selectItem(index)}
            >
              {item.element || item.title}
            </button>
          );
        })}
      </div>
    );
  }
}

export default CommandList;
