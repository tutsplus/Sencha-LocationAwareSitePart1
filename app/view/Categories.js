Ext.define('Locator.view.Categories', {
				extend: 'Ext.List',
				xtype: 'categories',
				config: {
								cls : 'default-bg category-list',
								itemTpl : '{name}',
								store : 'Categories',
								grouped : true,
								indexBar : true,
								title : Lang.home
				}
});
