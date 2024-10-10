grammar MyLanguage;

program: statement* EOF;

statement:
	variableDeclaration
	| assignment
	| expressionStatement;

variableDeclaration: 'var' Identifier ('=' expression)? ';';

assignment: Identifier '=' expression ';';

expressionStatement: expression ';';

expression:
	'(' expression ')'
	| expression binaryOp = ('*' | '/') expression
	| expression binaryOp = ('+' | '-') expression
	| Identifier
	| literal;

literal: NumericLiteral | StringLiteral;

Identifier: [a-zA-Z_][a-zA-Z0-9_]*;

NumericLiteral: [0-9]+;

StringLiteral: '"' .*? '"';

WS: [ \t\r\n]+ -> skip;

LINE_COMMENT: '//' ~[\r\n]* -> skip;

BLOCK_COMMENT: '/*' .*? '*/' -> skip;