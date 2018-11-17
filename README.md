# GrapherTalk
Reverse engineer to Desmos calculator for add some functionality

For a client web application I need add a mathematical expression graphic, I found [ desmos]( https://www.desmos.com/ "desmos") samples, this gays give the possibility to include that in your web application, but I need control a little more, first I pass as parameter to the HTML page and after I coming with the idea to communicate directly to the graphics windows. 

I create a small Web page that Open the local Desmos sample, I add some more stuff testing too. I make a small modification to the “[calculator_desktop.js](https://github.com/rag70/GrapherTalk/blob/master/Desmos/js/calculator_desktop.js)” file for get access to his model and I crate a “[Grapher.ts](https://github.com/rag70/GrapherTalk/blob/master/Desmos/js/Grapher.ts)” that receive the command from the another windows page,. I this case is the [Gtalk.html](https://github.com/rag70/GrapherTalk/blob/master/GrapherTalk/GTalk.html). 


![](https://raw.githubusercontent.com/rag70/GrapherTalk/master/imgs/help01.png)

This how look the desmos calculator

![](https://raw.githubusercontent.com/rag70/GrapherTalk/master/imgs/desmos.png)

I create a series of command that can be send to the windows, this windows have to be in your web site for the Cross Browser Problems :) using the windows.postMessage() function.

The command you can see in the code on  “[Grapher.ts](https://github.com/rag70/GrapherTalk/blob/master/Desmos/js/Grapher.ts)” but here is a resume.


1. exp  -> for a list of expression to the Calculator. 
			`exp:<Folder 01;'Sample 01;x^2;'Sample 02;x+5*y^2=0;>`  
2. gst  -> get state of the calculator
3. sst  -> set a state to the calculator
4. cx   -> Check if I have connection, I use before send any command on my application and I way if I didn't receive response then I open a new tab.
5. nFld  -> Create a new Folder, I prefer to use **exp** command 
* exp:<My folder;x^2;*
6. nTx -> Create a new Text, I prefer to use **exp** command 
* exp:'my test with a expression;x^2
7. nEx -> new expression
8. nTbl -> new table, I have to Finnish this on another moment 
9. gexps -> list all the expressions
10. gsel -> Get the selected item on the expression list 
11. cls  -> Clear all the expression 
12. sopt -> Set the option 
		    sopt:{
    		 "solutions":"false",
    		 "settingsMenu":"false",
    		 "border":"false",
    		 "branding":"false",
    		 "expressionsTopbar":"false",
    		 "graphpaper":"false",
    		 "zoomButtons":"false",
    		 "expressionsCollapsed":"true"
    		} 


I use Microsoft Visual Code with "Open Live Server" for work on this...
----------


has fun :)

  /Roberto Alonso G'omez.
