quiteUI
=======

write HTML in nearly pure javascript(coffeescript)

Useage
======

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

  * npm install
  * bower install
  * npm start (start development server in source watch mode) 
  * visit [http://localhost:3333/#todo](http://localhost:3333/#todo) to view the todo demo
