# MY EDITOR

a editor build with monaco editor and antlr4 and code formatter use antlr4 visitor pattern

## how to use

1. run `npm run g4` to generate the parser and lexer
2. run `npm run dev` to start the vite server
3. open `http://localhost:5173/` in your browser

## try format code

``` myLanguage
var x=1+2
x=x * 3
```

will be formatted to

``` myLanguage
var x = 1 + 2;


x = x * 3;
```
