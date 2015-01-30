Ext.define('Locator.controller.App', {
				extend : 'Ext.app.Controller',
				requires : ['Ext.device.Geolocation', 'Ext.Map'],
				util : Locator.util.Util,
				config : {
								refs : {
												categoriesList : 'categories',
												main : 'main',
												placeList : 'placelist'
								},
				
								control : {
												categoriesList : {
																itemtap : 'loadPlaces'
												}											
								}
				},
				
				/**
				 * Retrieve all the places for a particlur category
				 */
				loadPlaces : function(list, index, target, record){
								var me = this,
								loadPlaces = function(){ 
												// Show the place list page
												me.showPlaceList(record);
												
//												// Show a loading 
//												me.util.showLoading(me.getPlaceList(), true, Lang.loadingOf + record.get('name') + '...');												
//												
												store.getProxy().setExtraParams({
																//																location : me.util.userLocation,
																action : me.util.api.nearBySearch,
																location : me.util.defaultLocation,
																radius : me.util.defaultSearchRadius,
																sensor : false,
																key : me.util.API_KEY,
																types : record.get('type')
												});
												
												store.load(function(records){
																me.util.showLoading(me.getPlaceList(), false);	
												});
								},
								store = Ext.getStore('Places');
								
								// If user's location is already not set, fetch it. 
								// Else load the places for the saved user's location
								if(!me.util.userLocation){
												Ext.device.Geolocation.getCurrentPosition({
																success: function(position) {
																				me.util.userLocation = position.coords.latitude + ',' + position.coords.longitude;
																				loadPlaces();
																},
																failure: function() {
																				me.util.showMsg(Lang.locationRetrievalError);
																}
												});
								}else{
												// Clean the store if there is any previous data
												store.removeAll();
												loadPlaces();
								}
				},
				
				/**
				 * Retrieve all the places
				 */
				getPlaces : function(types){
								var me = this,
								loadPlaces = function(){ 
												var pageTitle = me.util.toTitleCase(types.split('_').join(' '));
												// Set title of placelist page
												me.getPlacelistTbar().setData({
																title : pageTitle
												});
												me.showPlaceList();
												
												me.util.showLoading(me.getPlaceList(), true, Lang.loadingOf + pageTitle + '...');												
												
												store.getProxy().setExtraParams({
																//																location : me.util.userLocation,
																action : me.util.api.nearBySearch,
																location : LocatrConfig.defaultLocation,
																radius : LocatrConfig.defaultSearchRadius,
																sensor : false,
																key : LocatrConfig.API_KEY,
																types : types
												});
												
												store.load(function(records){
																me.util.showLoading(me.getPlaceList(), false);	
												});
								},
								store = Ext.getStore('Places');
								
								if(!me.util.userLocation){
												Ext.device.Geolocation.getCurrentPosition({
																success: function(position) {
																				me.util.userLocation = position.coords.latitude + ',' + position.coords.longitude;
																				loadPlaces();
																},
																failure: function() {
																				me.util.showMsg(Lang.locationRetrievalError)
																}
												});
								}else{
												store.removeAll();
												loadPlaces();
								}
				},
				
				/**
				 * Show place list
				 */
				showPlaceList : function(record){
								this.getMain().push({
												xtype : 'placelist',
												title : record.get('name')
								});						
				},
				
				showPlaceLocation : function(){
								var me = this,
								showMarker = function(){
												var location = me.currentLocation.result.geometry.location,
												latLng = new google.maps.LatLng(location.lat,location.lng),
												image = new google.maps.MarkerImage('resources/images/marker.png',
																new google.maps.Size(32, 32),
																new google.maps.Point(0,0)
																);
																				
																				
												console.log('there is marker', location.lat,location.lng)
												if(me.singleMapMarker){
																me.singleMapMarker.setMap(null);
												}

												me.singleMapMarker = new google.maps.Marker({
																position: latLng, 
																map: me.singleLocationMap, 
																icon : image
												});
												
												me.singleLocationMap.panTo(latLng);
												me.singleLocationMap.setCenter(latLng);
								};
								
								if(!this.getSingleLocationMap()){
												Ext.create('Ext.Map', {
																renderTo : 	me.getPlaceDetailsInfo().element.down('.map'),
																height : 144,
																mapOptions : {
																				zoom : 15
																},
																listeners : {
																				maprender : function(mapCmp, gMap){
																								me.singleLocationMap = gMap;
																								showMarker();
																				}
																}
												});
								}else{
												showMarker();
								}
				}
});