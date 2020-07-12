import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Text, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
// import DefaultElement, { CodeElement, LeafElement } from "./Components";

// const macros = (event, editor) => {
//   switch (event.key) {
//     case "&":
//       // prevents '&' from being inserted
//       event.preventDefault();
//       editor.insertText("and");
//       break;
//     default:
//       break;
//   }
// };

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

const EditorExtended = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === "code"
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = EditorExtended.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = EditorExtended.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: n => Editor.isBlock(editor, n) }
    );
  }
};

const EditorComponent = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <LeafElement {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        setValue(newValue);
      }}
    >
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault();
            EditorExtended.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            EditorExtended.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "`":
              event.preventDefault();
              EditorExtended.toggleCodeBlock(editor);
              break;
            case "b":
              event.preventDefault();
              EditorExtended.toggleBoldMark(editor);
              break;
            default:
              break;
          }
        }}
      />
    </Slate>
  );
};

export default EditorComponent;
