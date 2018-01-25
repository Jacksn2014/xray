const React = require("react");
const ReactDOM = require("react-dom");
const PropTypes = require("prop-types");
const { styled } = require("styletron-react");
const xray = require("xray");
const ContentCanvas = require("./content_canvas");
const $ = React.createElement;

class TextEditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.setContentCanvas = this.setContentCanvas.bind(this);

    const buffer = new xray.TextBuffer(1);
    const editor = new xray.TextEditor(buffer, this.editorChanged.bind(this));

    if (props.initialText) {
      buffer.splice(0, 0, props.initialText);
    }

    window.setInterval(() => {
      this.setState({
        editorVersion: this.state.editorVersion + 1
      });
    }, 100)

    this.state = {
      editor: editor,
      offsetHeight: 0,
      offsetWidth: 0,
      editorVersion: 0
    };
  }

  setContentCanvas (contentCanvas) {
    this.contentCanvas = contentCanvas
  }

  componentDidMount() {
    const { offsetWidth, offsetHeight } = ReactDOM.findDOMNode(this);

    this.setState({
      offsetWidth,
      offsetHeight
    });
  }

  componentWillUnmount() {
    this.state.editor.destroy();
  }

  editorChanged() {
    this.setState({
      editorVersion: this.state.editorVersion + 1
    });
  }

  computeFrameState() {
    const { offsetHeight } = this.state;
    const { fontSize, lineHeight } = this.context.theme;
    return this.state.editor.render({
      offsetHeight,
      lineHeight: fontSize * lineHeight
    });
  }

  render() {
    const { offsetWidth, offsetHeight } = this.state;

    return $(TextEditor, {
      offsetWidth,
      offsetHeight,
      frameState: this.computeFrameState(),
      contentCanvasCreated: this.setContentCanvas
    });
  }
}

TextEditorContainer.contextTypes = {
  theme: PropTypes.object
};

const Root = styled("div", {
  width: "100%",
  height: "100%",
  overflow: "hidden"
});

function TextEditor(props) {
  return $(
    Root,
    null,
    $(ContentCanvas, {
      created: props.contentCanvasCreated,
      width: props.offsetWidth,
      height: props.offsetHeight,
      frameState: props.frameState
    })
  );
}

module.exports = TextEditorContainer;