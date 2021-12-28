import {Bridge} from './utils';
import ObjectView from './object-view';
import {ScrollView, StackLayout, Listeners, NavigationView, contentView} from 'tabris'


export default class Searchable {
  _target = null;
  _context = null;
  _inputListener = null;
  _listener = (nameEvent, listener) => {
    const event = new Listeners(this._target, nameEvent);
    event.addListener(listener);
    return event;
  }
  
  SearchService = class SearchService extends Bridge(this) {
    
    #boxResult = new ScrollView({
      top:$(NavigationView).only().toolbarHeight,
      left:0,
      right:0,
      height:180,
      background:'red',
      elevation: 100,
      layout: new StackLayout()
    });
    
    
    #input(text, lists) {
      this._target.proposals = lists.filter(name => 0<= name.indexOf(text.toLowerCase()))
    }
    
    #addListener(fun) {
      if (this._inputListener !== null) {
        this._inputListener = this._listener('input', fun)
      } else {
        this._target.addListener(fun);
      }
    }
    
    /**
     * @param {string[]} lists
     */
    simpleDataView(lists) {
      this.#addListener((e) => this.#input(e.text, lists));
    }
    
    customDataView(resource, lists, adapter) {
      const views = (lists) => {
        for (var i = 0, views = []; i < lists.length; i++) {
          views.push(adapter(
            ObjectView.from(this._context, resource).getView().shift(),
            lists[i],
            i
          ))
        }
        return views;
      }/*
      (
        new Array(lists.length)
        .map(, 0)
      ).map((view, i) => adapter(view, lists[i], i))
      */
      this._target.onSelect(() => {
        this.#boxResult.append(views(lists))
        console.log(views(lists),this._target.onFocus);
        contentView.append(this.#boxResult)
      })
      
      this.#addListener((e) => {
        
        if (!e.text) return;
        
      })
    }
  }
  
  constructor(context, target) {
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