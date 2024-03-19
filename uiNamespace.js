'use strict';
/*var filters_url_part='';
var filters_url_part1='';
var filters_url_part2='';
var filters_url_part3='';
var filters_url_part4='';
var filters_url_part5='';
var filters_url_part6='';
var filters_url_part7='';
var filters_url_part8='';
var filters_url_part9='';
*/
/*
var parameters_url_part='';
var parameters_url_part1='';
var parameters_url_part2='';
var parameters_url_part3='';
var parameters_url_part4='';
var parameters_url_part5='';
var parameters_url_part6='';
var parameters_url_part7='';
var parameters_url_part8='';
var parameters_url_part9='';
*/

//var filters_url_result='';
//var parameters_url_result='';

var var_count=0;
/**
 * UINamespace Sample Extension
 *
 * This sample extension demonstrates how to use the UI namespace
 * to create a popup dialog with additional UI that the user can interact with.
 * The content in this dialog is actually an extension as well (see the
 * uiNamespaceDialog.js for details).
 *
 * This sample is an extension that auto refreshes datasources in the background of
 * a dashboard.  The extension has little need to take up much dashboard space, except
 * when the user needs to adjust settings, so the UI namespace is used for that.
 */

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {

  $(document).ready(function () {
    // When initializing an extension, an optional object is passed that maps a special ID (which
    // must be 'configure') to a function.  This, in conjuction with adding the correct context menu
    // item to the manifest, will add a new "Configure..." context menu item to the zone of extension
    // inside a dashboard.  When that context menu item is clicked by the user, the function passed
    // here will be executed.
    tableau.extensions.initializeAsync({ configure: configure }).then(function () {
      // This event allows for the parent extension and popup extension to keep their
      // settings in sync.  This event will be triggered any time a setting is
      // changed for this extension, in the parent or popup (i.e. when settings.saveAsync is called).
      //tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, function(settingsEvent) {
      //  updateExtensionBasedOnSettings(settingsEvent.newSettings);
      //});
      console.log('Successfully initialized Extension');

      var SERVER_URL = tableau.extensions.settings.get("SERVER_URL");
      console.log(SERVER_URL)

      var SITE_URL = tableau.extensions.settings.get("SITE_URL");
      console.log(SITE_URL)

      var WORKBOOK_NAME = tableau.extensions.settings.get("WORKBOOK_NAME");
      var WORKBOOK_NAME_cleaned = WORKBOOK_NAME.split('\\').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('/').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split(':').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('*').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('?').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('"').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('<').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('>').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split('|').join('')
      WORKBOOK_NAME_cleaned = WORKBOOK_NAME_cleaned.split(' ').join('')
      console.log(WORKBOOK_NAME_cleaned)

      var DASHBOARD_NAME = tableau.extensions.settings.get("DASHBOARD_NAME");
      var DASHBOARD_NAME_cleaned = DASHBOARD_NAME.split('\\').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('/').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split(':').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('*').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('?').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('"').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('<').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('>').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split('|').join('')
      DASHBOARD_NAME_cleaned = DASHBOARD_NAME_cleaned.split(' ').join('')
      console.log(DASHBOARD_NAME_cleaned)


      var tooltip = tableau.extensions.settings.get("TOOLTIP_TEXT");

      let btn_tooltip=$('#submit')
      btn_tooltip.attr('title',tooltip)
      btn_tooltip.attr('aria-label',tooltip)

      //document.getElementById('submit').addEventListener("click", function(event) {
        $('#submit').bind("click", function(event) {
        event.preventDefault();
        window.focus();
        $('#image_id').attr('aria-label',"Download in progress. The CSV will download in another tab.");
        console.log("Download in progress.");
        fetchFilters().then(async function(filters_url_result) {
          return fetchParameters().then(async function(parameters_url_result) 
          { 
            if (SITE_URL=="Default")
            {
              document.getElementById('primaryButton').setAttribute("href",SERVER_URL+"/views/"+WORKBOOK_NAME_cleaned+"/"+DASHBOARD_NAME_cleaned+".csv?:refresh=y"+filters_url_result+parameters_url_result)
            }
            else
            {
              document.getElementById('primaryButton').setAttribute("href",SERVER_URL+"/t/"+SITE_URL+"/views/"+WORKBOOK_NAME_cleaned+"/"+DASHBOARD_NAME_cleaned+".csv?:refresh=y"+filters_url_result+parameters_url_result)
            } 
            console.log(document.getElementById('primaryButton').href)
          });
        }).then(async function(){
          document.getElementById('primaryButton').click();
        })

})

});
})

  function configure() {
    const popupUrl = './uiNamespaceDialog.html';
    let defaultPayload = "";
    tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:300, width:500 }).then(function(closePayload) {
    console.log("Roopa");
    }).catch(function(error) {
       switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
             console.log("Dialog was closed by user");
          break;
          default:
             console.error(error.message);
          }
       });
    }

    async function fetchFilters () {
      console.log("In fetchFilters")
      var filters_url_part='';
      var filters_url_part1='';
      var filters_url_part2='';
      var filters_url_part3='';
      var filters_url_part4='';
      var filters_url_part5='';
      var filters_url_part6='';
      var filters_url_part7='';
      var filters_url_part8='';
      var filters_url_part9='';
      var filters_url_all='';

      var NoOfFilters = tableau.extensions.settings.get("NoOfFilters");

      var arr = [];
      for (var i = 0; i < NoOfFilters; i++) {
        arr[i]=tableau.extensions.settings.get("filter"+String(i));
        console.log(arr[i]);
      }
      for (var i = NoOfFilters; i < 10; i++) {
        arr[i]='';
        console.log(arr[i]);
      }

      // Whenever we restore the filters table, remove all save handling functions,
      // since we add them back later in this function.
      //unregisterHandlerFunctions.forEach(function (unregisterHandlerFunction) {
      //  unregisterHandlerFunction();
      //});
  
      // Since filter info is attached to the worksheet, we will perform
      // one async call per worksheet to get every filter used in this
      // dashboard.  This demonstrates the use of Promise.all to combine
      // promises together and wait for each of them to resolve.
      let filterFetchPromises = [];
  
      // List of all filters in a dashboard.
      let dashboardfilters = [];
  
      // To get filter info, first get the dashboard.
      const dashboard = tableau.extensions.dashboardContent.dashboard;
  
      // Then loop through each worksheet and get its filters, save promise for later.
      dashboard.worksheets.forEach(function (worksheet) {
        filterFetchPromises.push(worksheet.getFiltersAsync());
      });

      //We are interested in the first worksheet (worksheets[0]) in the dashboard 
      //which is the data table to be exported as csv
      //filterFetchPromises.push(dashboard.worksheets[0].getFiltersAsync());
  
      // Now, we call every filter fetch promise, and wait for all the results
      // to finish before displaying the results to the user.
      await Promise.all(filterFetchPromises).then(function (fetchResults) {
        fetchResults.forEach(function (filtersForWorksheet) {
          filtersForWorksheet.forEach(function (filter) {
            dashboardfilters.push(filter);
          });
        });
  
          dashboardfilters.forEach(function(filter) {
          const valueStr = getFilterValues(filter);
          const filtername = filter.fieldName;
          if (filtername==arr[0])
          {
            filters_url_part='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[1])
          {
            filters_url_part1='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[2])
          {
            filters_url_part2='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[3])
          {
            filters_url_part3='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[4])
          {
            filters_url_part4='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[5])
          {
            filters_url_part5='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[6])
          {
            filters_url_part6='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[7])
          {
            filters_url_part7='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[8])
          {
            filters_url_part8='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }

          if (filtername==arr[9])
          {
            filters_url_part9='&'+filtername.replace(/ /g,'%20')+'='+valueStr
          }
          filters_url_all=filters_url_part+filters_url_part1+filters_url_part2+filters_url_part3+filters_url_part4+filters_url_part5+filters_url_part6+filters_url_part7+filters_url_part8+filters_url_part9;
        })
        //console.log(filters_url_all);
        //return filters_url_all
      })
      console.log(filters_url_all);
      return filters_url_all
    }
  
    async function fetchParameters() {
      console.log("In fetchParameters")
      var parameters_url_part='';
      var parameters_url_part1='';
      var parameters_url_part2='';
      var parameters_url_part3='';
      var parameters_url_part4='';
      var parameters_url_part5='';
      var parameters_url_part6='';
      var parameters_url_part7='';
      var parameters_url_part8='';
      var parameters_url_part9='';
      var parameters_url_all='';

      var NoOfParameters = tableau.extensions.settings.get("NoOfParameters");
      var arr = [];
      for (var i = 0; i < NoOfParameters; i++) {
        arr[i]=tableau.extensions.settings.get("parameter"+String(i));
        console.log(arr[i]);
      }
      for (var i = NoOfParameters; i < 10; i++) {
        arr[i]='';
        console.log(arr[i]);
      }

      const parameters = await tableau.extensions.dashboardContent.dashboard.getParametersAsync();
      parameters.forEach(function(p) {
        if (p.name==arr[0])
        {
          parameters_url_part='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[1])
        {
          parameters_url_part1='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[2])
        {
          parameters_url_part2='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[3])
        {
          parameters_url_part3='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[4])
        {
          parameters_url_part4='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[5])
        {
          parameters_url_part5='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[6])
        {
          parameters_url_part6='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[7])
        {
          parameters_url_part7='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[8])
        {
          parameters_url_part8='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }

        if (p.name==arr[9])
        {
          parameters_url_part9='&'+p.name.replace(/ /g,'%20')+'='+p.currentValue.value.replace(/ /g,'%20')
        }
        parameters_url_all=parameters_url_part+parameters_url_part1+parameters_url_part2+parameters_url_part3+parameters_url_part4+parameters_url_part5+parameters_url_part6+parameters_url_part7+parameters_url_part8+parameters_url_part9;
        //console.log(parameters_url_all);
        //return parameters_url_all
      })
      console.log(parameters_url_all);
      return parameters_url_all
    }
  
    // This returns a string representation of the values a filter is set to.
    // Depending on the type of filter, this string will take a different form.
    function getFilterValues (filter) {
      let filterValues = '';
      switch (filter.filterType) {
        case 'categorical':
          filter.appliedValues.forEach(function (value) {
            filterValues += value.value + ',';
            //filterValues += value.formattedValue + ',';
          });
          break;
        case 'range':
          // A range filter can have a min and/or a max.
          if (filter.minValue) {
            filterValues += 'min: ' + filter.minValue.formattedValue + ',';
          }
  
          if (filter.maxValue) {
            filterValues += 'max: ' + filter.maxValue.formattedValue + ',';
          }
          break;
        case 'relative-date':
          filterValues += 'Period: ' + filter.periodType + ',';
          filterValues += 'RangeN: ' + filter.rangeN + ',';
          filterValues += 'Range Type: ' + filter.rangeType + ',';
          break;
        default:
      }
      //remove last comma
      filterValues=filterValues.replace(/,(\s+)?$/, '');
      //replace spaces with %20
      filterValues=filterValues.replace(' ', '%20');
      return filterValues
    }
 })();

