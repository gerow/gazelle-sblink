window.transmission = (function() {
  var transmission = {};

  transmission.Client = function(url) {
    this.url = url;
    this.session_id = "";
  }

  // the success callback is in the form
  // funcion(result, arguments, tag)
  // with result being the result string from transmission, arguments
  // being a key-value list of arguments, and tag being the optional
  // tag we might get back
  //
  // The fail callback is called if we have some exceptional condition.
  transmission.Client.prototype.request = function(method, arguments, done, fail) {
    var ajax_obj = {};
    ajax_obj.url = this.url;
    var request_obj = {};
    request_obj.method = method;
    request_obj.arguments = arguments;
    ajax_obj.data = JSON.stringify(request_obj);
    ajax_obj.contentType = "application/json; charset=utf-8";
    ajax_obj.type = "POST";
    ajax_obj.headers = {
      "X-Transmission-Session-Id": this.session_id
    };
    ajax_obj.retries = 4;

    var this_client = this;

    var done_f = function(data, textStatus, xhr) {
      var result = data.result;
      var arguments = data.arguments;
      var tag = data.tag;

      done(result, arguments, tag);
    };

    var fail_f = function(xhr, textStatus, errThrown) {
      // if the status is 409 that means we need to update the
      // headers
      ajax_obj.retries--;
      if (xhr.status == 409 && ajax_obj.retries >= 0) {
        this_client.session_id = xhr.getResponseHeader("X-Transmission-Session-Id");
        ajax_obj.headers['X-Transmission-Session-Id'] = this_client.session_id;

        $.ajax(ajax_obj).fail(fail_f).done(done_f);

        return;
      }

      fail(xhr, textStatus, errThrown);
    };

    $.ajax(ajax_obj).done(done_f).fail(fail_f);
  };

  return transmission;
}());