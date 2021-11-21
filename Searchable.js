import {Bridge} from './utils';
import ObjectView from './object-view';
import {Popover, Listeners, NavigationView} from 'tabris'


export default class Searchable {
  _target = null;
  _context = null;
  
  _listener = (nameEvent, listener) => {
    const event = new Listeners(this._target, nameEvent);
    event.addListener(listener);
  }
  
  SearchService = class SearchService extends Bridge(this) {
    #boxResult = new Popover();
    
    /**
     * @param {string[]} lists
     */
    simpleDataView(lists) {
      this._target.proposals = lists;
    }
    
    customDataView(resource) {
      this.#boxResult.contentView.append(
        ObjectView.from(this._context, resource).getView()
      ).set({
        top: $(NavigationView).only().toolbarHeight
      });
      this.#boxResult.open();
    }
  }
  
  constructor(context, target) {
    this._context = context;
    this._target = target;
  }
  
  onQueryTextChange(fun) {
    this._listener('input', fun);
  }
  
  onQueryTextSubmit(fun) {
    this._listener('accept', fun);
  }
}