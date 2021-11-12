import * as tabris from 'tabris'

export class ViewProperties {
  static view_width = {
    fill_width: {
      left: 0,
      right: 0
    },
    wrap_content: {
      left: 'auto',
      right: 'auto'
    }
  }
  
  static view_height = {
    fill_height: {
      top: 0,
      bottom: 0
    },
    wrap_content: {
      top: 'auto',
      bottom: 'auto'
    }
  }
  
  static orientation = {
    vertical: {
      top: tabris.Constraint.prev
    },
    horizontal: {
      left: tabris.Constraint.prev
    }
  };
  
  static flex_orientation = {
    vertical: {
      layout: new tabris.StackLayout()
    },
    horizontal: {
      layout: new tabris.RowLayout()
    }
  }
}

export class MenuProperties {
  static icon = {
    image: ''
  }
  
  static showAsAction = {
    ifRoom: {
      placement: 'default'
    },
    hidden: {
      placement: 'overflow'
    }
  }
  
  static actionViewClass = null;
}