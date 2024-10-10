import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import antlr4 from "antlr4";
import MyLanguageLexer from "../parser/MyLanguageLexer.js";
import MyLanguageParser from "../parser/MyLanguageParser.js";
import MyLanguageVisitor from "../parser/MyLanguageVisitor.js";

const Editor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    // 注册自定义语言
    monaco.languages.register({ id: "myLanguage" });

    // 设置词法规则
    monaco.languages.setMonarchTokensProvider("myLanguage", {
      tokenizer: {
        root: [
          [/[a-zA-Z_$][\w$]*/, "identifier"],
          [/\d+/, "number"],
          { include: "@whitespace" },
          [/[\{\}\[\]\(\)]/, "@brackets"],
          [/[;,.]/, "delimiter"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"([^"\\]|\\.)*"/, "string"],
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/\/\*/, "comment", "@comment"],
          [/\/\/.*$/, "comment"],
        ],
        comment: [
          [/[^\/*]+/, "comment"],
          [/\/\*/, "comment", "@push"],
          ["\\*/", "comment", "@pop"],
          [/[\/*]/, "comment"],
        ],
      },
    });

    // 设置语言配置
    monaco.languages.setLanguageConfiguration("myLanguage", {
      comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });

    // 注册格式化器
    monaco.languages.registerDocumentFormattingEditProvider("myLanguage", {
      provideDocumentFormattingEdits: (model) => {
        const code = model.getValue();
        const formattedCode = formatCode(code);

        return [
          {
            range: model.getFullModelRange(),
            text: formattedCode,
          },
        ];
      },
    });

    // 创建编辑器实例
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: "",
      language: "myLanguage",
      theme: "vs-dark",
    });

    return () => {
      editorInstance.dispose();
    };
  }, []);

  // 代码格式化函数
  const formatCode = (code) => {
    try {
      const chars = new antlr4.InputStream(code);
      const lexer = new MyLanguageLexer(chars);
      const tokens = new antlr4.CommonTokenStream(lexer);
      const parser = new MyLanguageParser(tokens);
      parser.buildParseTrees = true;
      const tree = parser.program();

      const visitor = new MyLanguageFormatter();
      visitor.visit(tree);

      return visitor.getFormattedCode();
    } catch (error) {
      console.error("Formatting error:", error);
      return code;
    }
  };

  // 自定义格式化器
  class MyLanguageFormatter extends MyLanguageVisitor {
    constructor() {
      super();
      this.formattedCode = "";
      this.indentLevel = 0;
    }

    getFormattedCode() {
      return this.formattedCode;
    }

    indent() {
      return "  ".repeat(this.indentLevel);
    }

    visitProgram(ctx) {
      for (let statement of ctx.statement()) {
        this.visit(statement);
        this.formattedCode += "\n\n";
      }
    }

    visitStatement(ctx) {
      if (ctx.variableDeclaration()) {
        this.visit(ctx.variableDeclaration());
      } else if (ctx.assignment()) {
        this.visit(ctx.assignment());
      } else if (ctx.expression()) {
        this.visit(ctx.expression());
      }
    }

    visitVariableDeclaration(ctx) {
      this.formattedCode += this.indent() + "var " + ctx.Identifier().getText();
      if (ctx.expression()) {
        this.formattedCode += " = ";
        this.visit(ctx.expression());
      }
      this.formattedCode += ";";
    }

    visitAssignment(ctx) {
      this.formattedCode += this.indent() + ctx.Identifier().getText() + " = ";
      this.visit(ctx.expression());
      this.formattedCode += ";";
    }

    visitExpression(ctx) {
      if (ctx.literal()) {
        this.visit(ctx.literal());
      } else if (ctx.Identifier()) {
        this.formattedCode += ctx.Identifier().getText();
      } else if (ctx.binaryOp) {
        this.visit(ctx.expression(0));
        this.formattedCode += " " + ctx.binaryOp.text + " ";
        this.visit(ctx.expression(1));
      } else if (ctx.expression().length === 1) {
        this.formattedCode += "(";
        this.visit(ctx.expression(0));
        this.formattedCode += ")";
      }
    }

    visitLiteral(ctx) {
      if (ctx.NumericLiteral()) {
        this.formattedCode += ctx.NumericLiteral().getText();
      } else if (ctx.StringLiteral()) {
        this.formattedCode += ctx.StringLiteral().getText();
      }
    }
  }

  return <div ref={editorRef} style={{ height: "100vh", width: "100vw" }} />;
};

export default Editor;
