(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("Hash", function(exports, require, module) {
var Hash,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Hash = Hash = (function(_super) {
  __extends(Hash, _super);

  function Hash(pageOrHash) {
    var err, hash, _ref, _ref1;
    Hash.__super__.constructor.apply(this, arguments);
    this.attrs('page', 'action', 'params', 'hashStr');
    if (!pageOrHash) {
      pageOrHash = window.location.hash;
    }
    if (pageOrHash.indexOf('#') >= 0) {
      this._hashStr = pageOrHash;
      _ref = this._hashStr.split('?'), hash = _ref[0], this._params = _ref[1];
      if (this._params) {
        try {
          this._params = $.querystring(this._params);
        } catch (_error) {
          err = _error;
        }
      }
      _ref1 = hash.split('/'), this._page = _ref1[0], this._action = _ref1[1];
      this._page = this._page.split('#')[1];
    } else {
      if (!pageOrHash) {
        pageOrHash = 'home';
      }
      this.page(pageOrHash);
    }
  }

  Hash.prototype.assemble = function() {
    this._hashStr = "#" + this._page;
    if (this._action) {
      this._hashStr = "" + this._hashStr + "/" + this._action;
    }
    if (this._params) {
      this._hashStr = "" + this._hashStr + "?" + ($.querystring(this._params));
    }
    return this;
  };

  Hash.prototype.trigger = function() {
    this.assemble();
    return window.location.hash = this._hashStr;
  };

  return Hash;

})(Quite);
});

;require.register("block", function(exports, require, module) {
var Ls, block, blocks, func, funcs, json, piece, show, shows, _i, _j, _len, _len1;

json = JSON;

require('quite');

require('./Hash');

window.Ls = {
  setItem: function(name, item) {
    item = json.stringify(item);
    return localStorage.setItem(name, item);
  },
  getItem: function(name) {
    var item;
    item = localStorage.getItem(name);
    return json.parse(item);
  }
};

require('./bus');

require('./lit');

Ls = localStorage;

blocks = ['common/headbar', 'common/flash', 'todo', 'explore/library', 'explore/cate', 'explore/site', 'sheet/selectModal', 'common/dropdown', 'common/sheet', 'search/condition', 'sheet/title', 'common/page', 'common/panel', 'common/dish'];

shows = P.div('shows');

for (_i = 0, _len = blocks.length; _i < _len; _i++) {
  block = blocks[_i];
  show = require("pages/" + block + "/show");
  funcs = _.functions(show);
  for (_j = 0, _len1 = funcs.length; _j < _len1; _j++) {
    func = funcs[_j];
    piece = show[func]();
    piece.addClass('clear');
    shows.C(piece);
  }
}

window.onload = function() {
  return $('body').append(shows.elmt);
};
});

;require.register("bus", function(exports, require, module) {
var e, host, hosts, _fn, _i, _len, _ref;

window.Bus = {
  host: 'http://192.168.1.101:1337',
  currentPage: null,
  form: function(host, method) {
    return Bus[host]("" + host + "/" + method);
  },
  formSave: function(host) {}
};

hosts = {};

try {
  hosts = require('config');
} catch (_error) {
  e = _error;
  console.log(e);
  hosts = require('config-prod');
}

_ref = _.keys(hosts);
_fn = function(host) {
  var Host,
    _this = this;
  Bus[host] = function(queryString) {
    return "" + hosts[host] + "/" + queryString;
  };
  Host = host[0].toUpperCase() + host.slice(1);
  return window[Host] = function(queryString, params, cb) {
    var post, success, url;
    url = Bus[host](queryString);
    console.log(url);
    success = function(data, status, obj) {
      return cb(null, data);
    };
    post = $.post(url, params, success, 'json');
    return post.fail = cb;
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  host = _ref[_i];
  _fn(host);
}
});

;require.register("config-prod", function(exports, require, module) {
module.exports = {};
});

;require.register("config", function(exports, require, module) {
module.exports = {};
});

;require.register("index", function(exports, require, module) {
var frame, json, route;

json = JSON;

require('quite');

require('bus');

require('lit');

require('Hash');

route = require('route');

frame = require('pages/common/frame');

window.onload = function() {
  document.body.appendChild(frame.build().elmt);
  return route();
};
});

;require.register("lit", function(exports, require, module) {
window.Lit = {
  name: '名称',
  alias: '简称',
  des: '说明',
  confirm: '确定',
  cancel: '取消',
  submit: '提交',
  link: '链接',
  refresh: '刷新',
  show: '显示',
  hide: '隐藏',
  detail: '详细',
  back: '返回',
  change: '修改',
  title: '标题',
  save: '保存',
  index: '首页',
  explore: '浏览'
};
});

;require.register("pages/common/frame/index", function(exports, require, module) {
var Frame, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Frame = (function(_super) {
  __extends(Frame, _super);

  function Frame() {
    _ref = Frame.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Frame.prototype.build = function() {
    return this.piece = P.div('quite').C(this.content = P.div('content'));
  };

  Frame.prototype.setContent = function(page) {
    return this.content.C(page.piece);
  };

  return Frame;

})(Block);

module.exports = new Frame();
});

;require.register("pages/common/frame/show", function(exports, require, module) {

});

;require.register("pages/todo/Footer", function(exports, require, module) {
var Footer, StatusItem, StatusSet, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Footer = (function(_super) {
  __extends(Footer, _super);

  function Footer() {
    _ref = Footer.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Footer.prototype.render = function(D) {
    this.D = D;
    return Footer.__super__.render.call(this, this.D);
  };

  Footer.prototype.build = function() {
    var item, statu,
      _this = this;
    this.set = new StatusSet();
    this.piece = P.footer().id('footer').C(P.span().id('todo-count').C(P.strong().h('active'), ' items left'), this.set.items((function() {
      var _i, _len, _ref1, _results;
      _ref1 = ['all', 'active', 'completed'];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        statu = _ref1[_i];
        item = new StatusItem(statu);
        _results.push(item.set(this.set));
      }
      return _results;
    }).call(this)), this.set.build(), this.set.select(0), this.completed = P.button().id('clear-completed').C("Clear completed(", P.span().h('completed'), ")").onclick(function() {
      return _this._page.clearCompleted();
    }));
    return this.piece;
  };

  Footer.prototype.refresh = function(data) {
    Footer.__super__.refresh.apply(this, arguments);
    if (this.D.completed === 0) {
      return this.completed.hide();
    } else {
      if (this.completed._hide) {
        return this.completed.show();
      }
    }
  };

  Footer.prototype.select = function(index) {
    return this.set.select(index);
  };

  return Footer;

})(Matter);

StatusSet = (function(_super) {
  __extends(StatusSet, _super);

  function StatusSet() {
    _ref1 = StatusSet.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  StatusSet.prototype.build = function() {
    var item;
    this._items || (this._items = []);
    return this.piece = P.ul().id('filters').C((function() {
      var _i, _len, _ref2, _results;
      _ref2 = this._items;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        _results.push(item.build());
      }
      return _results;
    }).call(this));
  };

  return StatusSet;

})(RadioSet);

StatusItem = (function(_super) {
  __extends(StatusItem, _super);

  function StatusItem() {
    _ref2 = StatusItem.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  StatusItem.prototype.build = function() {
    var _this = this;
    return this.piece = P.li().C(this.link = P.a().href("#todo/" + this.D).C(this.D).onclick(function() {
      return _this._set.select(_this);
    }));
  };

  StatusItem.prototype.select = function() {
    return this.link.addClass('selected');
  };

  StatusItem.prototype.unselect = function() {
    return this.link.removeClass('selected');
  };

  return StatusItem;

})(Item);
});

;require.register("pages/todo/index", function(exports, require, module) {
var Footer, Todo, TodoItem, store, todo, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

store = require('./store');

Footer = require('./Footer');

Todo = (function(_super) {
  __extends(Todo, _super);

  function Todo() {
    this.completed = __bind(this.completed, this);
    this.active = __bind(this.active, this);
    this.all = __bind(this.all, this);
    this.render = __bind(this.render, this);
    _ref = Todo.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Todo.prototype.render = function(params) {
    var _this = this;
    return store.get({}, function(err, D) {
      _this.D = D;
    });
  };

  Todo.prototype.build = function() {
    var item, todo,
      _this = this;
    this.items = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = this.D;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        todo = _ref1[_i];
        _results.push(item = new TodoItem(todo).page(this));
      }
      return _results;
    }).call(this);
    this.piece = P.div().id('todo').C(P.section(status).id("todoapp").C(P.header().id('header').C(P.h1().C('todos'), this.newBox = P.inputBox().id('new-todo').placeholder('What need to be done?').autofocus(true).onkeyup(function(e) {
      if (e.which === 13) {
        todo = {};
        todo.title = _this.newBox.value();
        _this.newBox.value('');
        todo.isCompleted = false;
        return _this.add(todo);
      }
    })), P.section().id('main').C(P.div().style('display:block'), this.toggler = P.input().id('toggle-all').type('checkbox').onclick(function() {
      var checkStatus, _i, _len, _ref1, _results;
      console.log('toggle all', _this.toggler);
      checkStatus = _this.toggler.elmt.checked;
      _ref1 = _this.items;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        console.log(item.D.isCompleted, checkStatus);
        if (item.D.isCompleted !== checkStatus) {
          item.toggler.elmt.checked = checkStatus;
          _results.push(item.changeStatus());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }), P.label()["for"]('toggle-all').C('Mark all as complete'), this.container = P.ul().id('todo-list').C((function() {
      var _i, _len, _ref1, _results;
      _ref1 = this.items;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        item.build();
        _results.push(item.refresh(item.D).piece);
      }
      return _results;
    }).call(this))), this.footer = new Footer().page(this), this.footer.build()));
    this.updateFooter();
    return this.piece;
  };

  Todo.prototype.clearCompleted = function() {
    var i, item, _i, _ref1;
    for (i = _i = _ref1 = this.items.length - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
      item = this.items[i];
      console.log('item', item);
      if (item.D.isCompleted) {
        this.remove(item);
      }
    }
    return this.updateFooter();
  };

  Todo.prototype.remove = function(item) {
    var _this = this;
    return store.del(item.D, function(err, result) {
      var index;
      index = _this.items.indexOf(item);
      console.log(index);
      _this.D.splice(index, 1);
      item.piece.destroy();
      _this.items.splice(index, 1);
      console.log('D', _this.D);
      return _this.updateFooter();
    });
  };

  Todo.prototype.updateFooter = function() {
    var active, completed, count, info;
    count = this.D.length;
    completed = this.D.filter(function(todo) {
      return todo.isCompleted === true;
    });
    active = this.D.filter(function(todo) {
      return todo.isCompleted === false;
    });
    info = {
      active: active.length,
      completed: completed.length
    };
    return this.footer.refresh(info);
  };

  Todo.prototype.all = function() {
    if (this.piece) {
      return this.piece["class"]('');
    } else {
      this.build();
      return this.footer.select(0);
    }
  };

  Todo.prototype.active = function() {
    if (this.piece) {
      this.piece["class"]('active');
    } else {
      this.build('active');
    }
    return this.footer.select(1);
  };

  Todo.prototype.completed = function() {
    if (this.piece) {
      this.piece["class"]('complete');
    } else {
      this.build('complete');
    }
    return this.footer.select(2);
  };

  Todo.prototype["new"] = function(title) {
    return this.newBox.value(title);
  };

  Todo.prototype.add = function(todo) {
    var _this = this;
    if (!todo.title.trim()) {
      return;
    }
    return store.add(todo, function(err, todo) {
      var item;
      item = new TodoItem(todo).page(_this);
      _this.items.unshift(item);
      item.build();
      item.refresh(todo);
      _this.container.insert(item.piece, 0);
      _.insert(_this.D, todo, 0);
      return _this.updateFooter();
    });
  };

  return Todo;

})(Block);

TodoItem = (function(_super) {
  __extends(TodoItem, _super);

  function TodoItem() {
    _ref1 = TodoItem.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  TodoItem.prototype.build = function() {
    var animateClass,
      _this = this;
    console.log('D', this.D);
    animateClass = 'animated-item-view animated-item-view-end';
    this.piece = P.li(animateClass).C(P.div('view').C(this.toggler = P.input('toggle').type('checkbox').onclick(function() {
      return _this.changeStatus();
    }), this.view = P.label().h('title').ondblclick(function(e) {
      _this.piece.addClass('editing');
      _.clearSelection();
      return _this.edit.focus(true);
    }), P.button('destroy').onclick(function() {
      return _this._page.remove(_this);
    })), this.edit = P.input('edit').value(this.D.title).onkeyup(function(e) {
      if (e.which === 13) {
        return _this.changeTitle();
      }
    }).onblur(function() {
      return _this.changeTitle();
    }));
    if (this.D.isCompleted) {
      this.piece.addClass('completed');
      this.toggler.checked(true);
    }
    return this.piece;
  };

  TodoItem.prototype.changeTitle = function() {
    var _this = this;
    this.piece.removeClass('editing');
    this.D.title = this.edit.value();
    return store.mod(this.D, function(err, D) {
      _this.D = D;
      return _this.refresh(_this.D);
    });
  };

  TodoItem.prototype.changeStatus = function() {
    var _this = this;
    this.piece.toggleClass('completed');
    this.D.isCompleted = !this.D.isCompleted;
    return store.mod(this.D, function(err, D) {
      _this.D = D;
      return _this._page.updateFooter();
    });
  };

  return TodoItem;

})(Block);

module.exports = todo = new Todo();
});

;require.register("pages/todo/show", function(exports, require, module) {
var todo;

todo = require('./');

module.exports = {
  plain: function() {
    var todo1, todo2, todo3, todo4, todos;
    todos = [
      todo1 = {
        id: 1,
        isCompleted: true,
        title: 'confirm'
      }, todo2 = {
        id: 2,
        isCompleted: false,
        title: 'plan'
      }, todo3 = {
        id: 3,
        isCompleted: false,
        title: 'work'
      }, todo4 = {
        id: 4,
        isCompleted: false,
        title: 'check'
      }
    ];
    todo.D = todos;
    return todo.build();
  }
};
});

;require.register("pages/todo/store", function(exports, require, module) {
var json, lsUtil, store;

json = JSON;

module.exports = store = {
  add: function(todo, cb) {
    todo.id = "piece-todo-" + (new Date().valueOf());
    lsUtil.setItem(todo.id, todo);
    return cb(null, todo);
  },
  del: function(todo, cb) {
    lsUtil.removeItem(todo.id);
    return cb(null, todo);
  },
  mod: function(todo, cb) {
    console.log('todo', todo);
    lsUtil.setItem(todo.id, todo);
    return cb(null, todo);
  },
  get: function(condition, cb) {
    var fit, id, key, todo, todos, value;
    todos = [];
    for (id in localStorage) {
      todo = localStorage[id];
      if (id.indexOf('piece-todo') === 0) {
        todo = lsUtil.getItem(id);
        fit = true;
        for (key in condition) {
          value = condition[key];
          if (todo[key] !== value) {
            fit = false;
            break;
          }
        }
        if (fit) {
          todos.push(todo);
        }
      }
    }
    console.log(todos);
    todos.reverse();
    return cb(null, todos);
  }
};

lsUtil = {
  setItem: function(name, item) {
    item = json.stringify(item);
    console.log('set', item);
    return localStorage.setItem(name, item);
  },
  getItem: function(name) {
    var item;
    item = localStorage.getItem(name);
    console.log('get', item);
    if (item && item !== 'undefined') {
      return json.parse(item);
    }
  },
  removeItem: function(name) {
    return localStorage.removeItem(name);
  }
};
});

;require.register("quite/Editor", function(exports, require, module) {
var Editor, Matter, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Matter = require('./Matter');

module.exports = Editor = (function(_super) {
  __extends(Editor, _super);

  function Editor() {
    this.accept = __bind(this.accept, this);
    this.delivery = __bind(this.delivery, this);
    _ref = Editor.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Editor.prototype.matter = {};

  Editor.prototype.delivery = function() {
    this.matter.set(this.attributes);
    return this.matter.save();
  };

  Editor.prototype.accept = function(matter) {
    this.matter = matter;
    return this.set(this.matter.attributes);
  };

  return Editor;

})(Matter);
});

;require.register("quite/Quite", function(exports, require, module) {
var Quite,
  __slice = [].slice;

window.Quite = Quite = (function() {
  function Quite() {
    this._attrs = [];
  }

  Quite.prototype.attrs = function() {
    var attr, attrs, _i, _len, _results,
      _this = this;
    attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = attrs.length; _i < _len; _i++) {
      attr = attrs[_i];
      _results.push((function(attr) {
        if (attr instanceof Array) {
          return _this.attrs.apply(_this, attr);
        } else {
          _this._attrs.push(attr);
          return _this[attr] = function(attrValue) {
            if (attrValue === void 0) {
              return this["_" + attr];
            } else {
              this["_" + attr] = attrValue;
              return this;
            }
          };
        }
      })(attr));
    }
    return _results;
  };

  return Quite;

})();
});

;require.register("quite/S", function(exports, require, module) {

});

;require.register("quite/Site", function(exports, require, module) {
var Matter, Site, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Matter = require('./Matter');

module.exports = Site = (function(_super) {
  __extends(Site, _super);

  function Site() {
    _ref = Site.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Site.prototype.piece = {};

  Site.prototype.open = function() {
    return $('body').append(this.piece.elmt);
  };

  return Site;

})(Matter);
});

;require.register("quite/View", function(exports, require, module) {
var Piece, Quite, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Piece = require('base/Piece');

Quite = require('base/Quite');

module.exports = View = (function(_super) {
  __extends(View, _super);

  View.prototype.conf = {};

  View.prototype.model = {};

  View.prototype.piece = {};

  function View(params) {
    var _ref;
    this.piece = params != null ? params.piece : void 0;
    this.model = params != null ? params.model : void 0;
    this.conf = (_ref = params != null ? params.conf : void 0) != null ? _ref : {};
  }

  View.prototype.rebirth = function(model) {
    this.model = model;
    return this.render();
  };

  View.prototype.remove = function() {
    return this.piece.elmt.remove();
  };

  View.prototype.getTemplateData = function() {
    if (this.model.toJSON) {
      return this.model.toJSON();
    } else {
      return this.model;
    }
  };

  View.prototype.render = function() {
    var attr, attrView, element, elmt, elmts, holders, model, p, _i, _j, _len, _len1, _ref, _ref1, _results;
    model = this.getTemplateData();
    element = this.piece.elmt;
    holders = $('.pieceHolder');
    elmts = [];
    for (_i = 0, _len = holders.length; _i < _len; _i++) {
      elmt = holders[_i];
      elmts.push(elmt);
    }
    if (element.className.indexOf('pieceHolder') !== -1) {
      elmts.push(element);
    }
    console.log('elmts', elmts);
    _results = [];
    for (_j = 0, _len1 = elmts.length; _j < _len1; _j++) {
      elmt = elmts[_j];
      attr = elmt.getAttribute('data-holderid');
      console.log(attr);
      attrView = (_ref = this.conf) != null ? _ref["" + attr + "view"] : void 0;
      if (attrView) {
        _results.push(p = attrView(model[attr]));
      } else {
        console.log(attr);
        _results.push(elmt.textContent = (_ref1 = model[attr]) != null ? _ref1.toString() : void 0);
      }
    }
    return _results;
  };

  return View;

})(Quite);
});

;require.register("quite/base/Block", function(exports, require, module) {
var Block,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

window.Block = Block = (function(_super) {
  __extends(Block, _super);

  function Block(D) {
    this.D = D;
    Block.__super__.constructor.apply(this, arguments);
    this.attrs('page');
  }

  Block.prototype.D = {};

  Block.prototype.piece = {};

  Block.prototype.feed = function(D) {
    this.D = D;
  };

  Block.prototype.render = function(params) {
    var done, fail,
      _this = this;
    this.params = params;
    this.params || (this.params = {});
    if (this.needAcnt) {
      this.params.acntId = Bus.user.id;
      this.params.acntToken = Bus.user.token;
    }
    console.log(this.params);
    console.log('src', this.dataSrc);
    if (!this.dataSrc) {
      return;
    }
    done = function(data, status) {
      console.log('data', data);
      _this.D = data;
      return console.log('get', _this.D);
    };
    fail = function() {
      return console.log('error');
    };
    return $.ajax({
      url: this.dataSrc,
      data: this.params,
      dataType: 'json',
      success: done,
      error: fail,
      async: false
    });
  };

  Block.prototype.url = function(name) {
    this._page || (this._page = '');
    return "#" + this._page.config.name + "/" + name;
  };

  Block.prototype.remove = function() {
    return this.piece.remove();
  };

  Block.prototype.C = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    (_ref = this.piece).C.apply(_ref, args);
    return this;
  };

  Block.prototype.build = function() {
    return P.div('');
  };

  Block.prototype.refresh = function(data) {
    var attr, attrView, element, elmt, elmts, holders, _i, _j, _len, _len1, _ref, _ref1;
    if (data !== void 0) {
      this.D = data;
    }
    element = this.piece.elmt;
    holders = element.getElementsByClassName('pieceHolder');
    elmts = [];
    for (_i = 0, _len = holders.length; _i < _len; _i++) {
      elmt = holders[_i];
      elmts.push(elmt);
    }
    if (((_ref = element.className) != null ? _ref.indexOf('pieceHolder') : void 0) !== -1) {
      elmts.push(element);
    }
    for (_j = 0, _len1 = elmts.length; _j < _len1; _j++) {
      elmt = elmts[_j];
      attr = elmt.getAttribute('data-holderid');
      attrView = this["" + attr + "View"];
      if (typeof attrView === "function" ? attrView(this.D[attr]) : void 0) {
        elmt.innerHTML = (_ref1 = attrView(this.D[attr]).elmt) != null ? _ref1.outerHTML : void 0;
      } else {
        elmt.innerText = this.D[attr];
      }
    }
    return this;
  };

  return Block;

})(Quite);
});

;require.register("quite/base/Item", function(exports, require, module) {
var Item,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Item = Item = (function(_super) {
  __extends(Item, _super);

  function Item() {
    Item.__super__.constructor.apply(this, arguments);
    this.attrs('set');
  }

  Item.prototype.select = function() {
    return this.piece.addClass('select');
  };

  Item.prototype.unselect = function() {
    return this.piece.removeClass('select');
  };

  Item.prototype.trigger = function() {
    return this.link.click();
  };

  return Item;

})(Block);
});

;require.register("quite/base/RadioSet", function(exports, require, module) {
var RadioSet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.RadioSet = RadioSet = (function(_super) {
  __extends(RadioSet, _super);

  function RadioSet() {
    RadioSet.__super__.constructor.apply(this, arguments);
    this.attrs('items');
    this._select = void 0;
  }

  RadioSet.prototype.select = function(index) {
    if (index === void 0) {
      return this._select;
    } else {
      if (_.isObject(index)) {
        index = this._items.indexOf(index);
      }
      if (index !== this._select) {
        this._items[index].select();
        if (this._select || (this._select === 0)) {
          this._items[this._select].unselect();
        }
        return this._select = index;
      }
    }
  };

  return RadioSet;

})(Block);
});

;require.register("quite/form/field", function(exports, require, module) {
var Field;

module.exports = Field = (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
    this.attrs('title', 'value', 'viewer');
  }

  return Field;

})();
});

;require.register("quite/form/form", function(exports, require, module) {

});

;require.register("quite/i18n/base", function(exports, require, module) {
module.exports = {
  站: "site",
  面: "page",
  块: "block",
  条: "row",
  丁: "label",
  口: "link",
  图: "image",
  影: "video",
  集: "set",
  箱: "box",
  件: "item"
};
});

;require.register("quite/index", function(exports, require, module) {
require('./under');

require('./Quite');

require('./piece/Piece');

require('./base/Block');

require('./base/RadioSet');

require('./base/Item');

require('./slab/Icon');

require('./slab/Matter');

require('./slab/Set');

require('./slab/Form');

require('./slab/TableForm');

require('./slab/field/TableField');
});

;require.register("quite/piece/Piece", function(exports, require, module) {
var Piece, PieceSet, appendHTML, attrs, constants, elmtMethods, events, func, htmlElmtMethods, methods, nodeMethods, nodeProps, props, tags, _fn, _i, _len, _ref,
  __slice = [].slice;

constants = require('./constants');

attrs = constants.attrs();

events = constants.events();

props = constants.props();

nodeProps = constants.nodeProps();

props = props.concat(nodeProps);

tags = constants.tags();

nodeMethods = constants.nodeMethods();

elmtMethods = constants.elmtMethods();

htmlElmtMethods = constants.htmlElmtMethods();

methods = nodeMethods.concat(elmtMethods);

methods = methods.concat(htmlElmtMethods);

Piece = (function() {
  function Piece(elmt) {
    if (typeof elmt === 'string') {
      this.elmt = document.createElement(elmt);
    } else if (elmt instanceof Element) {
      this.elmt = elmt;
    }
  }

  Piece.prototype.h = function(attr) {
    return this.hold(attr);
  };

  Piece.prototype.hold = function(attr) {
    this.elmt.setAttribute('data-holderid', attr);
    this.addClass('pieceHolder');
    return this;
  };

  Piece.prototype.select = function(selector) {
    var elmt, elmts, name, type;
    type = selector[0];
    name = selector.slice(1);
    elmts = {};
    if (type === '#') {
      elmt = this.elmt.getElementById(name);
      return new Piece(elmt);
    } else if (type === '.') {
      elmts = this.elmt.getElementsByClassName(name);
      return new PieceSet(elmts);
    } else {
      elmts = this.elmt.getElementsByTagName(selector);
      return new PieceSet(elmts);
    }
  };

  Piece.prototype.render = function(data, attrView) {
    var attr, elmt, elmts, holders, piece, _i, _j, _len, _len1, _ref, _results;
    holders = this.select('.pieceHolder');
    elmts = [];
    for (_i = 0, _len = holders.length; _i < _len; _i++) {
      elmt = holders[_i];
      elmts.push(elmt);
    }
    if (this["class"]().indexOf('pieceHolder') >= 0) {
      holders.elmts.push(this);
    }
    _results = [];
    for (_j = 0, _len1 = holders.length; _j < _len1; _j++) {
      piece = holders[_j];
      attr = piece.attr('data-holderid');
      attrView = this["" + attr + "View"];
      if (typeof attrView === "function" ? attrView(this.get(attr)) : void 0) {
        _results.push(elmt.innerHTML = (_ref = attrView(this.get(attr)).elmt) != null ? _ref.outerHTML : void 0);
      } else {
        _results.push(elmt.innerText = this.get(attr));
      }
    }
    return _results;
  };

  Piece.prototype.attr = function(name, value) {
    if (value === void 0) {
      this.elmt.getAttribute(name);
    } else {
      this.elmt.setAttribute(name, value);
    }
    return this;
  };

  Piece.prototype.replace = function(piece) {
    var newElmt;
    newElmt = this.elmt.parentNode.insertBefore(piece.elmt, this.elmt);
    this.remove();
    this.elmt = newElmt;
    return this;
  };

  Piece.prototype.hide = function() {
    this._hide = true;
    this.style('display:none');
    return this;
  };

  Piece.prototype.show = function() {
    if (this._hide) {
      this._hide = false;
    }
    this.style('display');
    return this;
  };

  Piece.prototype.addClass = function(name) {
    this["class"]("" + name + " " + (this.className()));
    return this;
  };

  Piece.prototype.removeClass = function(name) {
    this["class"](this["class"]().replace("" + name, ''));
    return this;
  };

  Piece.prototype.toggleClass = function(name) {
    if (this["class"]().indexOf(name) >= 0) {
      return this.removeClass(name);
    } else {
      return this.addClass(name);
    }
  };

  Piece.prototype.remove = function() {
    console.log(this.elmt);
    console.log(this.elmt.parentNode);
    return this.elmt.parentElement.removeChild(this.elmt);
  };

  Piece.prototype.destroy = function() {
    return this.remove();
  };

  Piece.prototype.insert = function(elmt, position) {
    var children, target;
    if (elmt instanceof Piece) {
      elmt = elmt.elmt;
    }
    children = this.childNodes();
    if (position < 0) {
      position = 0;
    }
    if (position >= children.length) {
      console.log(elmt);
      return this.appendChild(elmt);
    } else {
      target = children[position];
      return this.insertBefore(elmt, target);
    }
  };

  Piece.prototype.move = function(current, targetPosition) {
    if (typeof current === 'number') {
      current = this.children(current);
    }
    return this.insert(current, targetPosition);
  };

  Piece.prototype.del = function(position) {};

  Piece.prototype.C = function() {
    var children,
      _this = this;
    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (!children) {
      return this.elmt;
    }
    children.forEach(function(child) {
      if (!child) {
        return;
      }
      if (child instanceof Piece) {
        return _this.elmt.appendChild(child.elmt);
      } else if (child instanceof Function) {
        return _this.C(child());
      } else if (child instanceof Array) {
        return _this.C.apply(_this, child);
      } else if (child.piece) {
        return _this.C(child.piece);
      } else {
        return appendHTML(_this.elmt, child.toString());
      }
    });
    return this;
  };

  Piece.prototype.reC = function() {
    var children;
    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.elmt.innerHTML = '';
    return this.C.apply(this, children);
  };

  return Piece;

})();

appendHTML = function(parent, html) {
  var child, div, _i, _len, _ref, _results;
  div = document.createElement('div');
  div.innerHTML = html;
  _ref = div.childNodes;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    child = _ref[_i];
    _results.push(parent.appendChild(child));
  }
  return _results;
};

attrs.forEach(function(attr) {
  attr = attr.trim();
  return Piece.prototype[attr] = function(value) {
    if (value !== void 0) {
      if (value instanceof Piece) {
        value = value.elmt;
      }
      this.elmt.setAttribute(attr, value);
      return this;
    } else {
      return this.elmt.getAttribute(attr);
    }
  };
});

events.forEach(function(event) {
  event = event.trim();
  return Piece.prototype[event] = function(func) {
    if (func) {
      this.elmt[event] = func;
    }
    return this;
  };
});

props.forEach(function(prop) {
  prop = prop.trim();
  return Piece.prototype[prop] = function(value) {
    if (value !== void 0) {
      this.elmt[prop] = value;
      return this;
    } else {
      return this.elmt[prop];
    }
  };
});

methods.forEach(function(method) {
  method = method.trim();
  return Piece.prototype[method] = function() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.elmt)[method].apply(_ref, args);
  };
});

Piece.prototype.value = function(value) {
  if (value !== void 0) {
    this.elmt['value'] = value;
    return this;
  } else {
    return this.elmt['value'];
  }
};

PieceSet = (function() {
  function PieceSet(elmts) {
    var elmt, _i, _len, _ref;
    this.elmts = elmts;
    this.set = [];
    _ref = this.elmts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elmt = _ref[_i];
      this.set.push(new Piece(elmt));
    }
  }

  PieceSet.prototype.run = function() {
    var args, funName, piece, _i, _len, _ref, _results;
    funName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    _ref = this.set;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      piece = _ref[_i];
      _results.push(piece[funName].apply(piece, args));
    }
    return _results;
  };

  return PieceSet;

})();

_ref = Object.keys(Piece.prototype);
_fn = function(func) {
  if (Piece.prototype[func] instanceof Function) {
    return PieceSet.prototype[func] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.run.apply(this, [func].concat(__slice.call(args)));
    };
  }
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  func = _ref[_i];
  _fn(func);
}

window.P = function(selector, element) {
  var elmt, elmts, name, type;
  if (element == null) {
    element = document;
  }
  if (selector instanceof Element) {
    return new Piece(selector);
  }
  type = selector[0];
  name = selector.slice(1);
  elmts = {};
  if (type === '#') {
    elmt = element.getElementById(name);
    return new Piece(elmt);
  } else if (type === '.') {
    elmts = element.getElementsByClassName(name);
    return new PieceSet(elmts);
  } else {
    elmts = element.getElementsByTagName(selector);
    return new PieceSet(elmts);
  }
};

tags.forEach(function(tag) {
  tag = tag.trim();
  return P[tag] = function(className) {
    if (className) {
      return new Piece(tag)["class"](className);
    } else {
      return new Piece(tag);
    }
  };
});

P.inputBox = function(className) {
  if (className) {
    return P.input(className).type('text');
  } else {
    return P.input().type('text');
  }
};
});

;require.register("quite/piece/constants", function(exports, require, module) {
var constants;

module.exports = constants = {
  tags: function() {
    return "doctype,      html,      head,      body,      h1,      h6,      p,      ul,      ol,      dl,      a,      table,      strong,      b,      div,      header,      nav,      article,      footer,      aside,      section,      img,      map,      area,      form,      input,      !DOCTYPE,      a,      abbr,      acronym,      address,      applet,      area,      article,      aside,      audio,      b,      base,      basefont,      bdi,      bdo,      big,      blockquote,      body,      br,      button,      canvas,      caption,      center,      cite,      code,      col,      colgroup,      command,      datalist,      dd,      del,      details,      dfn,      dir,      div,      dl,      dt,      em,      embed,      fieldset,      figcaption,      figure,      font,      footer,      form,      frame,      frameset,      h1,      h2,      h3,      h4,      h5,      h6,      head,      header,      hgroup,      hr,      html,      i,      iframe,      img,      input,      ins,      kbd,      keygen,      label,      legend,      li,      link,      map,      mark,      menu,      meta,      meter,      nav,      noframes,      noscript,      object,      ol,      optgroup,      option,      output,      p,      param,      pre,      progress,      q,      rp,      rt,      ruby,      s,      samp,      script,      section,      select,      small,      source,      span,      strike,      strong,      style,      sub,      summary,      sup,      table,      tbody,      td,      textarea,      tfoot,      th,      thead,      time,      title,      tr,      track,      tt,      u,      ul,      var,      video,      wbr,      abbr,      object".split(',');
  },
  attrs: function() {
    return "accept,      accept-charset,      accesskey,      action,      align,      alt,      async,      autocomplete,      autofocus,      autoplay,      bgcolor,      border,      buffered,      challenge,      charset,      checked,      cite,      class,      code,      codebase,      color,      cols,      colspan,      content,      contenteditable,      contextmenu,      controls,      coords,      data,      datetime,      default,      defer,      dir,      dirname,      disabled,      download,      draggable,      dropzone,      enctype,      for,      form,      headers,      height,      hidden,      high,      href,      hreflang,      http-equiv,      icon,      id,      ismap,      itemprop,      keytype,      kind,      label,      lang,      language,      list,      loop,      low,      manifest,      max,      maxlength,      media,      method,      min,      multiple,      name,      novalidate,      open,      optimum,      pattern,      ping,      placeholder,      poster,      preload,      pubdate,      radiogroup,      readonly,      rel,      required,      reversed,      rows,      rowspan,      sandbox,      spellcheck,      scope,      scoped,      seamless,      selected,      shape,      size,      sizes,      span,      src,      srcdoc,      srclang,      start,      step,      style,      summary,      tabindex,      target,      title,      type,      usemap,      value,      width,      wrap".split(',');
  },
  events: function() {
    return "onabort      ,onblur      ,onchange      ,onclick      ,onclose      ,oncontextmenu      ,ondblclick      ,onerror      ,onfocus      ,oninput      ,onkeydown      ,onkeypress      ,onkeyup      ,onload      ,onmousedown      ,onmousemove      ,onmouseout      ,onmouseover      ,onmouseup      ,onscroll      ,onselect      ,onsubmit".split(',');
  },
  props: function() {
    return "classList      ,className      ,clientHeight      ,clientLeft      ,clientTop      ,clientWidth      ,id      ,innerHTML      ,outerHTML      ,scrollHeight      ,scrollLeft      ,scrollTop      ,scrollWidth      ,tagName".split(',');
  },
  nodeProps: function() {
    return "attributes      ,baseURI      ,baseURIObject      ,childNodes      ,firstChild      ,lastChild      ,localName      ,namespaceURI      ,nextSibling      ,nodeName      ,nodePrincipal      ,nodeType      ,nodeValue      ,ownerDocument      ,parentElement      ,parentNode      ,prefix      ,previousSibling      ,textContent".split(',');
  },
  nodeMethods: function() {
    return "      appendChild,      cloneNode,      compareDocumentPosition,      contains,      getUserData,      hasAttributes,      hasChildNodes,      insertBefore,      isDefaultNamespace,      isEqualNode,      isSameNode,      isSupported,      lookupNamespaceURI,      lookupPrefix,      normalize,      removeChild,      replaceChild,      setUserData    ".split(',');
  },
  elmtMethods: function() {
    return "      getAttributeNS,      getAttributeNode,      getAttributeNodeNS,      getBoundingClientRect,      undefined,      getClientRects,      undefined,      getElementsByClassName,      getElementsByTagName,      getElementsByTagNameNS,      hasAttribute,      hasAttributeNS,      insertAdjacentHTML,      matches,      querySelector,      querySelectorAll,      removeAttribute,      removeAttributeNS,      removeAttributeNode,      requestFullscreen,      requestPointerLock,      scrollIntoView,      setAttribute,      setAttributeNS,      setAttributeNode,      setAttributeNodeNS,      setCapture,      supports,      getAttribute    ".split(',');
  },
  htmlElmtMethods: function() {
    return ['blur', 'click', 'focus'];
  }
};
});

;require.register("quite/route", function(exports, require, module) {
var Route,
  __slice = [].slice;

window.R = Route = (function() {
  Route.prototype.currentCommand = [];

  Route.prototype.currentPipers = [];

  Route.prototype.currentPage = {};

  Route.prototype.lastPipers = [];

  Route.prototype.pages = {};

  function Route(body) {
    var currenthash;
    this.body = body;
    if (!window.location.hash) {
      window.location.hash = "#lei,changyong,1";
      currenthash = "#lei,changyong,1";
    }
  }

  Route.prototype.route = function() {
    var currenthash, hash;
    hash = window.location.hash.split('#')[1];
    currenthash = '';
    return window.onhashchange = function() {
      var args, command, commandName, pipers, _ref;
      hash = window.location.hash.split('#')[1];
      command = hash.split('|')[0];
      pipers = hash.split('|').slice(1);
      if (command === this.currentCommand) {
        if (pipers === this.currentPipers) {

        } else {
          this.lastPipers = this.currentPipers;
          this.currentPipers = pipers;
          return runPipers();
        }
      } else {
        this.currentCommand = command;
        _ref = command.split(','), commandName = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        command = require("page/" + commandName + "/index");
        this.currentPage.hide();
        return this.body.appendChild;
      }
    };
  };

  Route.prototype.runPipers = function() {
    var args, index, piper, piperName, startRun, _i, _len, _ref, _ref1;
    startRun = false;
    _ref = this.currentPipers;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      piper = _ref[index];
      if ((!startRun) || (piper === lastPipers[index])) {
        return;
        _ref1 = pipers.split(','), piperName = _ref1[0], args = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
      }
    }
  };

  return Route;

})();
});

;require.register("quite/slab/Form", function(exports, require, module) {
var Form,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Form = Form = (function(_super) {
  __extends(Form, _super);

  function Form(className) {
    this.trigger = __bind(this.trigger, this);
    Form.__super__.constructor.apply(this, arguments);
    this.piece = P.div(className);
  }

  Form.prototype.build = function() {
    return this.piece = P.div(className);
  };

  Form.prototype.trigger = function(_trigger) {
    var _this = this;
    this._trigger = _trigger;
    console.log('trigger', this._trigger);
    this.piece.C(this._trigger);
    this._trigger.onclick(function() {
      var input, inputs, param, post, success, _i, _len;
      if (_this._before) {
        _this._before();
      }
      inputs = $('input[name], textarea[name]', _this.piece.elmt);
      console.log(inputs);
      param = {};
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        input = $(input);
        param[input.attr('name')] = input.val();
      }
      if (Bus.user) {
        param.acntId = Bus.user.id;
        param.acntToken = Bus.user.token;
      }
      success = function(data, status, obj) {
        console.log('data', data);
        console.log(obj);
        return _this._cb(data);
      };
      post = $.post(_this._url, param, success, 'json');
      return post.fail(function(xhr, status, error) {
        console.log('fail', status, error);
        return _this._cb();
      });
    });
    this.piece.elmt.onkeyup = function(e) {
      if (e.which === 13) {
        return _this._trigger.click();
      }
    };
    return this;
  };

  Form.prototype.before = function(_before) {
    this._before = _before;
    return this;
  };

  Form.prototype.cb = function(_cb) {
    this._cb = _cb;
    return this;
  };

  Form.prototype.url = function(_url) {
    this._url = _url;
    return this;
  };

  return Form;

})(Block);
});

;require.register("quite/slab/Icon", function(exports, require, module) {
window.Icon = function(name) {
  return P.i("fa fa-" + name);
};
});

;require.register("quite/slab/Item", function(exports, require, module) {
var Item;

module.exports = Item = (function() {
  function Item() {}

  Item.prototype.piece = {};

  Item.prototype.attr = '';

  Item.prototype.text = '';

  Item.prototype.h = function(attr) {
    this.attr = attr;
    return this;
  };

  Item.prototype.label = function(text) {
    this.text = text;
    return this;
  };

  Item.prototype.build = function() {
    return this.piece;
  };

  Item.prototype.hide = Item.piece.hide();

  Item.prototype.show = Item.piece.show();

  Item.prototype.remove = Item.piece.remove();

  return Item;

})();
});

;require.register("quite/slab/Link", function(exports, require, module) {
var Link, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Link = (function(_super) {
  __extends(Link, _super);

  function Link() {
    _ref = Link.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Link.prototype.build = function() {
    return this.piece = P.a('a link');
  };

  return Link;

})(Item);
});

;require.register("quite/slab/LinkRadioSet", function(exports, require, module) {
var LinkRadioSet, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = LinkRadioSet = (function(_super) {
  var LinkItem, _ref1;

  __extends(LinkRadioSet, _super);

  function LinkRadioSet() {
    _ref = LinkRadioSet.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LinkRadioSet.prototype.build = function() {
    var item;
    this._items || (this._items = []);
    return this.piece = P.div().C(P.ul('cates').C((function() {
      var _i, _len, _ref1, _results;
      _ref1 = this._items;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        _results.push(item.build());
      }
      return _results;
    }).call(this)));
  };

  LinkRadioSet.prototype.LinkItem = LinkItem = (function(_super1) {
    __extends(LinkItem, _super1);

    function LinkItem() {
      _ref1 = LinkItem.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    LinkItem.prototype.build = function() {
      var _this = this;
      return this.piece = P.li('cate').C(P.button('').C(this.D.name).onclick(function() {
        return _this._set.select(_this);
      }));
    };

    return LinkItem;

  })(Item);

  return LinkRadioSet;

})(RadioSet);
});

;require.register("quite/slab/List", function(exports, require, module) {

});

;require.register("quite/slab/Matter", function(exports, require, module) {
var Matter,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Matter = Matter = (function(_super) {
  __extends(Matter, _super);

  Matter.prototype.piece = {};

  Matter.prototype.build = function() {
    return this.piece = P.span('');
  };

  function Matter() {
    Matter.__super__.constructor.apply(this, arguments);
  }

  Matter.prototype.render = function(D) {
    var attr, attrView, element, elmt, elmts, holders, _i, _j, _len, _len1, _ref, _ref1;
    this.D = D;
    element = this.piece.elmt;
    holders = element.getElementsByClassName('pieceHolder');
    elmts = [];
    for (_i = 0, _len = holders.length; _i < _len; _i++) {
      elmt = holders[_i];
      elmts.push(elmt);
    }
    if (((_ref = element.className) != null ? _ref.indexOf('pieceHolder') : void 0) !== -1) {
      elmts.push(element);
    }
    for (_j = 0, _len1 = elmts.length; _j < _len1; _j++) {
      elmt = elmts[_j];
      attr = elmt.getAttribute('data-holderid');
      attrView = this["" + attr + "View"];
      if (typeof attrView === "function" ? attrView(this.D[attr]) : void 0) {
        elmt.innerHTML = (_ref1 = attrView(this.D[attr]).elmt) != null ? _ref1.outerHTML : void 0;
      } else {
        elmt.innerText = this.D[attr];
      }
    }
    return this;
  };

  return Matter;

})(Block);
});

;require.register("quite/slab/Popup", function(exports, require, module) {
var Popup;

module.exports = Popup = (function() {
  function Popup(position, elmt) {}

  return Popup;

})();
});

;require.register("quite/slab/RadioSet", function(exports, require, module) {
var RadioSet, Set,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Set = require('base/Set');

module.exports = RadioSet = (function(_super) {
  __extends(RadioSet, _super);

  function RadioSet(models, options) {
    var _this = this;
    RadioSet.__super__.constructor.call(this, models, options);
    this.on('add', function(model) {
      return _this.select(model);
    });
  }

  RadioSet.prototype.selected = {};

  RadioSet.prototype.select = function(model) {
    var _ref;
    if ((_ref = this.selected) != null) {
      if (typeof _ref.toggleSelect === "function") {
        _ref.toggleSelect();
      }
    }
    this.selected = model;
    this.trigger('select', model);
    return model.toggleSelect();
  };

  return RadioSet;

})(Set);
});

;require.register("quite/slab/Row", function(exports, require, module) {

});

;require.register("quite/slab/Set", function(exports, require, module) {
var Set,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Set = Set = (function(_super) {
  __extends(Set, _super);

  function Set() {
    Set.__super__.constructor.apply(this, arguments);
    this.attrs('container', 'blocks', 'models', 'init');
    this._blocks = [];
  }

  Set.prototype.build = function() {
    var block, model;
    return this._piece = this._container.C((function() {
      var _i, _len, _ref, _results;
      _ref = this._models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        block = this._init(model);
        this._blocks.push(block);
        _results.push(block.build());
      }
      return _results;
    }).call(this));
  };

  Set.prototype.remove = function(position) {};

  Set.prototype.move = function(block, position) {
    _.move(this._blocks, block, position);
    return this._container.move(block.piece.elmt, position);
  };

  Set.prototype.insert = function(block, position) {
    _.insert(this._blocks, block, position);
    return this._container.insert(block.piece, position);
  };

  return Set;

})(Quite);
});

;require.register("quite/slab/TableForm", function(exports, require, module) {
var TableForm,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('./Form');

window.TableForm = TableForm = (function(_super) {
  __extends(TableForm, _super);

  function TableForm(className) {
    TableForm.__super__.constructor.apply(this, arguments);
    this.piece = P.table("table-form " + className);
  }

  TableForm.prototype.build = function() {
    return this.piece;
  };

  return TableForm;

})(Form);
});

;require.register("quite/slab/field/TableField", function(exports, require, module) {
var TableField,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.TableField = TableField = (function(_super) {
  __extends(TableField, _super);

  function TableField() {
    this.val = __bind(this.val, this);
    TableField.__super__.constructor.apply(this, arguments);
    this.attrs('title', 'name', 'autofocus');
  }

  TableField.prototype.save = function() {
    this.D[this._name] = this.view.value();
    return this;
  };

  TableField.prototype.val = function(value) {
    return this.view.value(value);
  };

  TableField.prototype.build = function() {
    return this.piece = P.tr().C(P.th().C("" + this._title + ":"), P.td().C(this.buildView(), this.appendView));
  };

  TableField.prototype.buildView = function() {
    var value;
    this.view = P.inputBox(this._name).name(this._name);
    if (value = this.D[this._name]) {
      this.view.value(this.D[this._name]);
    }
    if (this._autofocus) {
      this.view.autofocus(true);
    }
    return this.view;
  };

  TableField.prototype.append = function(appendView) {
    this.appendView = appendView;
    return this;
  };

  return TableField;

})(Block);
});

;require.register("quite/under/common", function(exports, require, module) {
var Common, Url;

Common = (function() {
  function Common() {}

  Common.prototype.clearSelection = function() {
    var sel;
    if (document.selection && document.selection.empty) {
      return document.selection.empty();
    } else if (window.getSelection) {
      sel = window.getSelection();
      return sel.removeAllRanges();
    }
  };

  Common.prototype.move = function(array, current, targetIndex) {
    if (typeof current !== 'number') {
      current = array.indexOf(current);
    }
    if (targetIndex < 0) {
      targetIndex = 0;
    }
    return array.splice(targetIndex, 0, array.splice(current, 1)[0]);
  };

  Common.prototype.insert = function(array, item, position) {
    return array.splice(position, 0, item);
  };

  Common.prototype.keycode = function(num) {
    var keycode_dict;
    keycode_dict = require('./constants').keycode_dict;
    return keycode_dict[num];
  };

  Common.prototype.url = function(url) {
    return new Url(url);
  };

  Common.prototype.ajax = function(url, params, done) {
    var fail;
    fail = function() {
      return console.log('error');
    };
    return $.ajax({
      url: url,
      data: params,
      dataType: 'json',
      success: done,
      error: fail,
      async: false
    });
  };

  return Common;

})();

module.exports = new Common();

Url = (function() {
  function Url(url) {
    this.url = url;
  }

  Url.prototype.get = function(attrName) {
    return $.url(attrName, this.url);
  };

  return Url;

})();
});

;require.register("quite/under/constants", function(exports, require, module) {
module.exports = {
  keycode_dict: {
    0: "\\",
    8: "backspace",
    9: "tab",
    12: "num",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "caps",
    27: "esc",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    44: "print",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "cmd",
    92: "cmd",
    93: "cmd",
    96: "num_0",
    97: "num_1",
    98: "num_2",
    99: "num_3",
    100: "num_4",
    101: "num_5",
    102: "num_6",
    103: "num_7",
    104: "num_8",
    105: "num_9",
    106: "num_multiply",
    107: "num_add",
    108: "num_enter",
    109: "num_subtract",
    110: "num_decimal",
    111: "num_divide",
    124: "print",
    144: "num",
    145: "scroll",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "\'",
    223: "`",
    224: "cmd",
    225: "alt",
    57392: "ctrl",
    63289: "num",
    59: ";"
  }
};
});

;require.register("quite/under/index", function(exports, require, module) {
var common;

common = require('./common');

console.log('insert', _.move);

console.log('common', common.insert);

_.extend(_, common);

console.log('insert', _.move);
});

;require.register("quite/under/test/common", function(exports, require, module) {
var TestCommon, common;

common = require('../common');

module.exports = TestCommon = (function() {
  function TestCommon() {}

  TestCommon.prototype.move = function() {
    var array;
    array = ['zero', 'one', 'two', 'three'];
    common.move(array, 'one', 2);
    return console.log(array);
  };

  return TestCommon;

})();
});

;require.register("quite/under/test/test", function(exports, require, module) {
var method, methods, _i, _len;

methods = ["Element.getAttributeNS", "Element.getAttributeNode", "Element.getAttributeNodeNS", "Element.getBoundingClientRect", "", "Element.getClientRects", "", "Element.getElementsByClassName", "Element.getElementsByTagName", "Element.getElementsByTagNameNS", "Element.hasAttribute", "Element.hasAttributeNS", "Element.insertAdjacentHTML", "Element.matches", "Element.querySelector", "Element.querySelectorAll", "Element.removeAttribute", "Element.removeAttributeNS", "Element.removeAttributeNode", "Element.requestFullscreen", "Element.requestPointerLock", "Element.scrollIntoView", "Element.setAttribute", "Element.setAttributeNS", "Element.setAttributeNode", "Element.setAttributeNodeNS", "Element.setCapture", "Element.supports", "element.getAttribute", ""];

for (_i = 0, _len = methods.length; _i < _len; _i++) {
  method = methods[_i];
  console.log(method.split('.')[1] + ',');
}
});

;require.register("route", function(exports, require, module) {
var frame, route,
  _this = this;

frame = require('pages/common/frame');

window.onhashchange = function() {
  return route();
};

module.exports = route = function(hash) {
  var page, target;
  if (!hash) {
    hash = new Hash();
  }
  page = require("pages/" + (hash.page()));
  if (page.needAcnt && !(Bus.user && Bus.user.token)) {
    new Hash('curtain').params(target = {
      target: hash.hashStr()
    }).trigger();
    return;
  }
  hash.action() || hash.action('index');
  if (page === Bus.currentPage) {
    if (page[hash.action()]) {
      return page[hash.action()](hash.params());
    }
  } else {
    window.onkeyup = null;
    if (Bus.currentPage) {
      Bus.currentPage.remove();
    }
    if (hash.page() === 'curtain') {
      frame.piece.hide();
      page.build();
      document.body.appendChild(page.piece.elmt);
    } else {
      console.log(page);
      frame.piece.show();
      page.render(hash.params());
      page.build();
      frame.setContent(page);
    }
    Bus.currentPage = page;
    if (page[hash.action()]) {
      return page[hash.action()]();
    }
  }
};
});

;require.register("slab/ActionLink", function(exports, require, module) {
var ActionLink;

module.exports = ActionLink = (function() {
  function ActionLink() {}

  ActionLink.prototype.text = '';

  ActionLink.prototype.actionName = '';

  ActionLink.prototype.action = function() {};

  ActionLink.prototype.onclick = function(action) {
    this.action = action;
  };

  ActionLink.prototype.flag = function(actionName) {
    this.actionName = actionName;
  };

  ActionLink.prototype.build = function() {
    this.piece = P.a().href("#").h(this.text).onclick(this.action);
    if (this.actionName) {
      this.piece.C(P.i()["class"](S["icon-" + actionName]));
    }
    return this.piece;
  };

  return ActionLink;

})();
});

;
//@ sourceMappingURL=app.js.map