// Generated from MyLanguage.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';

// This class defines a complete generic visitor for a parse tree produced by MyLanguageParser.

export default class MyLanguageVisitor extends antlr4.tree.ParseTreeVisitor {

	// Visit a parse tree produced by MyLanguageParser#program.
	visitProgram(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#statement.
	visitStatement(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#variableDeclaration.
	visitVariableDeclaration(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#assignment.
	visitAssignment(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#expressionStatement.
	visitExpressionStatement(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#expression.
	visitExpression(ctx) {
	  return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by MyLanguageParser#literal.
	visitLiteral(ctx) {
	  return this.visitChildren(ctx);
	}



}