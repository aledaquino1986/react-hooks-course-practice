import React from "react";
import PropTypes from "prop-types";

const styles = {
  content: {
    fontSize: "35px",
    position: "absolute",
    left: "0",
    right: "0",
    marginTop: "20px",
    textAlign: "center"
  }
};

function Loading({ text = "Loading", speed = 300 }) {
  const [content, setContent] = React.useState(text);

  React.useEffect(() => {
    const interval = setInterval(() => {
      content === text + "..."
        ? setContent(text)
        : setContent(previousContent => previousContent + ".");
    }, speed);

    return () => clearInterval(interval);
  }, [content]);

  return <p style={styles.content}>{content}</p>;
}

export default Loading;

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number
};
