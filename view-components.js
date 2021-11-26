import { ViewProperties } from './view-property-components'
import tabris from 'tabris'
import store from './store'

/**
 * @param {string} orientation
 * @param {object} orientationProperty
 */
function existsOrThrowOrientation(orientation, orientationProperty) {
  if (orientation in orientationProperty) {
    return true;
  }
  throw new Error(`orientation ${orientation} not exists`)
}

include.createContext = props => include(props);

export function include({ view }) {
  return require(`../res/view/${view}.json`)
}

export class Page extends tabris.Page {
  constructor(props, AppContext) {
    super(props);
    this.context = AppContext;

    this.on('appear', () => {
      if (store.has(AppContext)) {
        $(tabris.NavigationView).only().append(store.get(AppContext));
      }
    })

    this.on('disappear', () => {
      if (store.has(AppContext)) {
        store.get(AppContext).detach();
      }
    })
  }

  static createContext(props, AppContext) {
    return new this(props, AppContext);
  }
}

export class View extends tabris.Composite {
  context = null;
  align_orientation = null;

  constructor(props, AppContext) {
    super(props);
    this.context = AppContext;
  }

  append(widgets) {
    let childs = Array.isArray(widgets) ? widgets : [widgets];
    if (this.align_orientation) childs.forEach(widget => widget.set(this.align_orientation));
    return super.append(childs);
  }

  static createContext(props, context) {
    const attrs = Object.assign({}, props);

    delete props.orientation;
    delete props.view_width;
    delete props.view_height;

    if (attrs.view_width && attrs.view_width in ViewProperties.view_width) {
      props = Object.assign(props, ViewProperties.view_width[attrs.view_width]);
    }
    if (attrs.view_height && attrs.view_height in ViewProperties.view_height) {
      props = Object.assign(props, ViewProperties.view_height[attrs.view_height]);
    }

    const view = new this(props, context);

    if (attrs.orientation && existsOrThrowOrientation(attrs.orientation, ViewProperties.orientation)) {
      view.align_orientation = ViewProperties.orientation[attrs.orientation];
    }

    return view;
  }
}

export class FlexView extends View {
  static createContext(attrs, context) {
    if ('orientation' in attrs && existsOrThrowOrientation(attrs.orientation, ViewProperties.flex_orientation)) {
      Object.assign(attrs, ViewProperties.flex_orientation[attrs.orientation]);
      delete attrs.orientation;
    }
    return super.createContext(attrs, context);
  }
}

export class HorizontalScrollView extends tabris.ScrollView {
  constructor(props) {
    super({
      direction: 'horizontal',
      ...props
    })
  }

  static createContext(attrs) {
    return new this(attrs);
  }
}

export const root = FlexView.createContext({
  orientation: 'vertical',
  view_width: 'fill_width',
  view_height: 'fill_height'
})

export class ViewGroup {
  childs = [];

  constructor(_, AppContext) {
    this.context = AppContext;
  }

  addTo(parent) {
    parent.append(this.childs)
  }

  append(widget) {
    this.childs.push(widget)
  }

  static createContext(props, context) {
    return new this(props, context);
  }
}

export class RootView extends ViewGroup {

  constructor(props) {
    super();
    this.props = props;
  }

  addTo() {
    super.addTo(root);
  }
}

export class NavigationDrawer extends ViewGroup {
  constructor({ menu }, ctx) {
    super();
    this.res = R.menu[menu].shift().menu;
    this.context = ctx;
  }

  addTo() {
    const items = [];

    this.res.forEach(item => {
      if (Array.isArray(item.item)) {
        let findIndex = items.findIndex(it => it.isGroup);
        if (findIndex == -1) findIndex = items.length;
        items.splice(findIndex, 0, item.attributes);
      } else {
        items.push({ isGroup: true, title: item.attributes.title },
          ...item.group.map(item => item.attributes)
        );
      }
    });

    let collection = new tabris.CollectionView({
      left: 0,
      top: 'prev() 10',
      right: 0,
      bottom: 0,
      itemCount: items.length,
      cellType: index => items[index].isGroup,
      cellHeight: (_, type) => type ? 48 : 38,
      createCell(isGroup) {
        return isGroup ? new tabris.TextView({
          padding: 10,
          textColor: 'gray'
        }) : FlexView.createContext({
          orientation: 'horizontal',
          view_width: 'fill_width',
          highlightOnTouch: true,
          padding: 10,
        });
      },
      updateCell: (view, i) => {
        let item = items[i];

        if (view instanceof tabris.TextView) {
          view.text = item.title.toUpperCase();
        } else {
          if (item.icon) {
            view.append(new tabris.ImageView({
              image: item.icon,
              centerY: true
            }));
          }

          view.append(new tabris.TextView({
            centerY: true,
            text: item.title,
            left: (item.icon ? 10 : 30),
            ...(item.id ? { id: item.id } : {})
          }))

          view.onTap(() => {
            tabris.drawer.close()
            setTimeout(() => this.context.onActionItemSelected(), 500);
          })
        }
      }
    });
    this.append(collection);
    super.addTo(tabris.drawer);
  }
}