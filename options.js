function add_status_text(text) {
  $status = $("div#status");
  $status.html($status.html() + "<br/>" + text);
}

function commit_options(url) {
  chrome.storage.sync.set({
    transmission_url: url
    }, function() {
      add_status_text("Options saved!");
  });
}

function save_options() {
  var url = $("input[name=transmission_url]").val();
  add_status_text("got url " + url);
  add_status_text("requesting permissions to access " + url);
  chrome.permissions.request({
    origins: [url]
  }, function(granted) {
    if (!granted) {
      add_status_text("permission not granted for access. URL not saved.");
      return;
    }
    add_status_text("attempting to get session info from transmission server at " + url);
    var client = new transmission.Client(url);
    var fail_f = function() {
      add_status_text("failed to communicate with " + url + ". URL not saved.");
      add_status_text("are you sure this is a transmission server? (it should look something like http://example.com/transmission/rpc)");
      chrome.permissions.remove({
        origins: [url]
      }, function(removed) {});
    
    }
    client.request("session-get", {}, function(result, arguments, tag) {
      if (result != "success") {
        add_status_text("result: " + result);
        fail_f();
        return;
      }
      add_status_text("success!")
      commit_options(url);
    }, fail_f);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    transmission_url: ""
  }, function(items) {
    $("input[name=transmission_url]").val(items.transmission_url);
  });
}

$(document).ready(restore_options);
$("button#save").click(save_options);