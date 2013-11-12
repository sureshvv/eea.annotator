if(window.EEA === undefined){
  var EEA = {
    who: 'eea.annotator',
    version: '1.0'
  };
}

EEA.Annotator = function(context, options){
 var self = this;
  self.context = context;

  self.settings = {
    readOnly: self.context.data('readonly') || 0,
    prefix: '',
    user: {
      id: 'anonymous',
      name: 'Anonymous'
    },
    urls: {
      create:  '/annotations_edit',
      read:    '/annotations_view/:id',
      update:  '/annotations_edit/:id',
      destroy: '/annotations_edit/:id',
      search:  '/annotations_search'
    }
  };

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

EEA.Annotator.prototype = {
  initialize: function(){
    var self = this;
    self.reload();
  },

  reload: function(){
    var self = this;

    // Init annotator
    jQuery('#content').annotator({
      readOnly: Boolean(self.settings.readOnly)
    });

    // Permissions plugin
    jQuery('#content').annotator('addPlugin', 'Permissions', {
      user: self.settings.user,
      userId: function(user){
        if(user && user.id){
          return user.id;
        }else{
          return user;
        }
      },
      userString: function(user){
        if(user && user.name && user.id){
          return user.name + ' @' + user.id;
        }else{
          return user;
        }
      },
      showViewPermissionsCheckbox: false,
      showEditPermissionsCheckbox: false
    });

    // // Reply plugin
    //jQuery('#content').annotator('addPlugin', 'Comment');

    // Storage plugin
    jQuery('#content').annotator('addPlugin', 'Store', {
      prefix: self.settings.prefix,
      urls: self.settings.urls
    });

  }
};


jQuery.fn.EEAAnnotator = function(options){
  return this.each(function(){
    var context = jQuery(this);
    var adapter = new EEA.Annotator(context, options);
    context.data('EEAAnnotator', adapter);
  });
};

jQuery(document).ready(function(){
  var items = jQuery(".eea-annotator");
  if(!items.length){
    return;
  }

  var userid = items.data('userid') || 'anonymous';
  var username = items.data('username') || userid;
  var settings = {
    prefix: jQuery('base').attr('href') + '/annotator.api',
    user: {
      id: userid,
      name: username
    }
  };

  items.EEAAnnotator(settings);
});
