'use strict';

/**
 * UINamespace Sample Extension
 *
 * This is the popup extension portion of the UINamespace sample, please see
 * uiNamespace.js in addition to this for context.  This extension is
 * responsible for collecting configuration settings from the user and communicating
 * that info back to the parent extension.
 *
 * This sample demonstrates two ways to do that:
 *   1) The suggested and most common method is to store the information
 *      via the settings namespace.  The parent can subscribe to notifications when
 *      the settings are updated, and collect the new info accordingly.
 *   2) The popup extension can receive and send a string payload via the open
 *      and close payloads of initializeDialogAsync and closeDialog methods.  This is useful
 *      for information that does not need to be persisted into settings.
 */

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {

  $(document).ready(function () {
    // The only difference between an extension in a dashboard and an extension
    // running in a popup is that the popup extension must use the method
    // initializeDialogAsync instead of initializeAsync for initialization.
    // This has no affect on the development of the extension but is used internally.
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      
      document.getElementById('server_link').value = tableau.extensions.settings.get("SERVER_URL");
      document.getElementById('site_link').value = tableau.extensions.settings.get("SITE_URL");
      document.getElementById('workbook_link').value = tableau.extensions.settings.get("WORKBOOK_NAME");
      document.getElementById('dashboard_link').value = tableau.extensions.settings.get("DASHBOARD_NAME");

      document.getElementById('tooltip_text').value = tableau.extensions.settings.get("TOOLTIP_TEXT");
      
      getWorksheets();

      $('#div_parameter_id label').remove();
      $('#div_parameter_id input').remove();
      $('#div_parameter_id br').remove();
      
      getParameters();

      //if (document.getElementById(tableau.extensions.settings.get("WORKSHEET_SELECTED_RADIO_ID")).checked) {
      if (tableau.extensions.settings.get("WORKSHEET_SELECTED_RADIO_ID")) {
        $('#'+tableau.extensions.settings.get("WORKSHEET_SELECTED_RADIO_ID")).attr('checked', true);
     
        $('#div_filter_id label').remove();
        $('#div_filter_id input').remove();
        $('#div_filter_id br').remove();
        getFilters($('#'+tableau.extensions.settings.get("WORKSHEET_SELECTED_RADIO_ID")).val());      
      }

      $('#div_worksheet_id input:radio').click(function() {
        $('#div_filter_id label').remove();
        $('#div_filter_id input').remove();
        $('#div_filter_id br').remove();
        getFilters($(this).val());
      });

      $('#cancel').click(closeDialog);
      $('#save').click(saveButton);
    });
  });

function getWorksheets()
{
  const worksheets=tableau.extensions.dashboardContent.dashboard.worksheets;
      worksheets.forEach(function (worksheet, counter) {
        var hold = document.getElementById("div_worksheet_id");
        var radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "worksheets";
        radio.value = worksheet.name;
        radio.id = "worksheet"+String(counter);
        var label = document.createElement('label');
        label.id = "label_worksheet"+String(counter);
        label.innerHTML = worksheet.name;
        hold.appendChild(radio);
        hold.appendChild(label);
        var br = document.createElement("br");
        hold.appendChild(br);
      })
}

async function getParameters() {
  console.log("In fetchParameters")
  const parameters = await tableau.extensions.dashboardContent.dashboard.getParametersAsync();
  parameters.forEach(function(p, counter) {
    var hold = document.getElementById("div_parameter_id");
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "parameters";
    checkbox.value = p.name;
    checkbox.id = "parameter"+String(counter);
    var label = document.createElement('label');
    label.id = "label_parameter"+String(counter);
    label.innerHTML = p.name;
    hold.appendChild(checkbox);
    hold.appendChild(label);
    var br = document.createElement("br");
    hold.appendChild(br);
  });
  $("#div_parameter_id input:checkbox").each(function(i) {
    var checkbox = document.getElementById("parameter"+String(i));
    for (let j = 0; j < 10; j++) {
      if (tableau.extensions.settings.get("parameter"+String(j))==checkbox.value)
      {
        checkbox.checked = true;
      }
    }

  });
}

function getFilters(radio_button_worksheet) {
  console.log("In fetchFilters")
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
      if (worksheet.name==radio_button_worksheet)
      {
        filterFetchPromises.push(worksheet.getFiltersAsync());
      }
    });

  //We are interested in the first worksheet (worksheets[0]) in the dashboard 
  //which is the data table to be exported as csv
  //filterFetchPromises.push(dashboard.worksheets[0].getFiltersAsync());

  // Now, we call every filter fetch promise, and wait for all the results
  // to finish before displaying the results to the user.
  Promise.all(filterFetchPromises).then(function (fetchResults) {
    fetchResults.forEach(function (filtersForWorksheet) {
      filtersForWorksheet.forEach(function (filter) {
        dashboardfilters.push(filter);
      });
    });

    dashboardfilters.forEach(function (filter, counter) {
      const filtername = filter.fieldName;
      var hold = document.getElementById("div_filter_id");
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "filters";
      checkbox.value = filtername;
      checkbox.id = "filter"+String(counter);
      var label = document.createElement('label');
      label.id = "label_filter"+String(counter);
      label.innerHTML = filtername;
      hold.appendChild(checkbox);
      hold.appendChild(label);
      var br = document.createElement("br");
      hold.appendChild(br);

    })
    $("#div_filter_id input:checkbox").each(function(i) {
      var checkbox = document.getElementById("filter"+String(i));
      for (let j = 0; j < 10; j++) {
        if (tableau.extensions.settings.get("filter"+String(j))==checkbox.value)
        {
          checkbox.checked = true;
        }
      }

    });
  });
}

function closeDialog() {
  tableau.extensions.ui.closeDialog("10");
}

function saveButton() {

  tableau.extensions.settings.set("SERVER_URL", document.getElementById('server_link').value);
  tableau.extensions.settings.set("SITE_URL", document.getElementById('site_link').value);
  tableau.extensions.settings.set("WORKBOOK_NAME", document.getElementById('workbook_link').value);
  tableau.extensions.settings.set("DASHBOARD_NAME", document.getElementById('dashboard_link').value);

  tableau.extensions.settings.set("TOOLTIP_TEXT", document.getElementById('tooltip_text').value);

  tableau.extensions.settings.set("WORKSHEET_SELECTED_RADIO_ID", $('#div_worksheet_id :radio:checked').attr('id'));

  var Count=0;
  $("#div_parameter_id input:checkbox").each(function(i) {
    var checkbox = document.getElementById("parameter"+String(i));
    if (checkbox.checked) 
    {
      tableau.extensions.settings.set("parameter"+String(Count), checkbox.value);
      Count=Count+1;
    }
  });

  tableau.extensions.settings.set("NoOfParameters", Count);
  for (var i = Count; i < 10; i++) {
    tableau.extensions.settings.set("parameter"+String(i), '');
  }

  var Count1=0;
  $("#div_filter_id input:checkbox").each(function(i) {
    var checkbox = document.getElementById("filter"+String(i));
    if (checkbox.checked)
    {
      tableau.extensions.settings.set("filter"+String(Count1), checkbox.value);
      Count1=Count1+1;
    }
  });

  tableau.extensions.settings.set("NoOfFilters", Count1);
  for (var i = Count1; i < 10; i++) {
    tableau.extensions.settings.set("filter"+String(i), '');
  }

  tableau.extensions.settings.saveAsync().then(function(currentSettings) {
      tableau.extensions.ui.closeDialog("10");
  });

}

})();
