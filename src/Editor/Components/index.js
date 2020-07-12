const DefaultElement = props => {
  const { attributes, children } = props;
  return <p {...attributes}>{children}</p>;
};

const CodeElement = props => {
  const { attributes, children } = props;
  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

const LeafElement = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

export { DefaultElement as default, CodeElement, LeafElement };
