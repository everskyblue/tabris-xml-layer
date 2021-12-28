"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const object_view_1 = __importDefault(require("./object-view"));
const tabris_1 = require("tabris");
class Searchable {
    constructor(context, target) {
        var _SearchService_instances, _SearchService_boxResult, _SearchService_input, _SearchService_addListener, _a;
        this._target = null;
        this._context = null;
        this._inputListener = null;
        this._listener = (nameEvent, listener) => {
            const event = new tabris_1.Listeners(this._target, nameEvent);
            event.addListener(listener);
            return event;
        };
        this.SearchService = (_a = class SearchService extends (0, utils_1.Bridge)(this) {
                constructor() {
                    super(...arguments);
                    _SearchService_instances.add(this);
                    _SearchService_boxResult.set(this, new tabris_1.ScrollView({
                        top: $(tabris_1.NavigationView).only().toolbarHeight,
                        left: 0,
                        right: 0,
                        height: 180,
                        background: 'red',
                        elevation: 100,
                        layout: new tabris_1.StackLayout()
                    }));
                }
                /**
                 * @param {string[]} lists
                 */
                simpleDataView(lists) {
                    __classPrivateFieldGet(this, _SearchService_instances, "m", _SearchService_addListener).call(this, (e) => __classPrivateFieldGet(this, _SearchService_instances, "m", _SearchService_input).call(this, e.text, lists));
                }
                customDataView(resource, lists, adapter) {
                    const views = (lists) => {
                        for (var i = 0, views = []; i < lists.length; i++) {
                            views.push(adapter(object_view_1.default.from(this._context, resource).getView().shift(), lists[i], i));
                        }
                        return views;
                    }; /*
                    (
                      new Array(lists.length)
                      .map(, 0)
                    ).map((view, i) => adapter(view, lists[i], i))
                    */
                    this._target.onSelect(() => {
                        __classPrivateFieldGet(this, _SearchService_boxResult, "f").append(views(lists));
                        console.log(views(lists), this._target.onFocus);
                        tabris_1.contentView.append(__classPrivateFieldGet(this, _SearchService_boxResult, "f"));
                    });
                    __classPrivateFieldGet(this, _SearchService_instances, "m", _SearchService_addListener).call(this, (e) => {
                        if (!e.text)
                            return;
                    });
                }
            },
            _SearchService_boxResult = new WeakMap(),
            _SearchService_instances = new WeakSet(),
            _SearchService_input = function _SearchService_input(text, lists) {
                this._target.proposals = lists.filter(name => 0 <= name.indexOf(text.toLowerCase()));
            },
            _SearchService_addListener = function _SearchService_addListener(fun) {
                if (this._inputListener !== null) {
                    this._inputListener = this._listener('input', fun);
                }
                else {
                    this._target.addListener(fun);
                }
            },
            _a);
        target.proposals = [];
        this._context = context;
        this._target = target;
    }
    onQueryTextChange(fun) {
        this._inputListener = this._listener('input', fun);
    }
    onQueryTextSubmit(fun) {
        this._listener('accept', e => {
            if (this._isSubscribe) {
                e.target.values.unsubscribe();
            }
            fun(e);
        });
    }
}
exports.default = Searchable;
