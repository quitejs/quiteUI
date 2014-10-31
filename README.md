#quiteUI

write web App in nearly pure javascript(coffeescript) a different way 

#Usage

  * first you should have [Node.js](http://nodejs.org/) and [coffeescript](http://coffeescript.org/) installed
  * install [brunch](brunch.io)

  ```
  sudo npm install -g brunch 
  ```
  * this project use the extention name 'cf' for coffeescript files, so you should custom your coffeescript lib(under __/usr/local/lib/node_modules/coffee-script__ in my ubuntu) by modify the file __lib/coffee-script/coffee-script.js__, in the line 23, add the 'cf' extension and the final code is:

  ```javascript
  exports.FILE_EXTENSIONS = ['.cf', '.coffee', '.litcoffee', '.coffee.md'];
  ```
  * and custom the brunch by modify the __coffee-script-brunch__
   module under node_modules, change __lib/index.js__ in the line 32,add the 'cf' extension, the final code is :

  ```javascript
  CoffeeScriptCompiler.prototype.pattern = /\.(cf|coffee|coffee\.md|litcoffee)$/;
  ```

  * install dependencies and start
  ```
  npm install
  bower install
  npm start (start development server in source watch mode) 
  ```
  * visit [http://localhost:3333/#todo](http://localhost:3333/#todo) to view the todo demo

  * to start a new project based on quiteUI, just run 
  ```
  brunch new gh:quitejs/quiteUI <your-project-name>
  ```
  * the main source code of quite is under the __app/quite__ directory, and the demo of todo is under the __app/pages/todo__

#Philosopy

###programmatic
   HTML is a great tool to build UIs, but it's not programmatic, then we can't use the power of switch, loop, function, object, class to simplify things as we do in javascript or other programming language, so the first mission of quiteUI is to turn HTML to programmatic .

###dont't pre-encapsulation
  quiteUI is target to offer a set of tools, or a set of prototypes later, and encapsulate things as little as possible . you encapsulate it based on the complexity of your project . 

###objective 
  quiteUI adopt coffeescript(a meta-language of javascript) to write objective code more fancy, and make write UIs like write backend code, like write ruby code. 

###modularity
  modulariy is great method to turn a large, complex project into little and simple ones. 

###anti-MVC
  quiteUI use modularity than layer to simplify things, sure you can adopt any pattern inside a module if necessary
  

