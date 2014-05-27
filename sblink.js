(function() {
  function qualifyURL(url) {
    var img = document.createElement('img');
    img.src = url; // set string url
    url = img.src; // get qualified url
    img.src = null; // no server request
    return url;
  }

  var transmission_session_id = "";

  $(document).ready(function() {
    var mod_fxn = function() {
      $this = $(this);
      href = $this.attr("href");
      url = qualifyURL(href);
      //$new_anchor = $("<a href=\"http://bt.cshaus.com/\">SB</a>");
      $new_anchor = $(document.createElement("a"));
      $new_anchor.attr("href", "#");
      $new_anchor.html("SB");
      $this.after($new_anchor).after(" | ");
      $new_anchor.click(function(event) {
        event.preventDefault();
        $(this).html(chrome.extension.getURL("throbber.gif"));
        $throbber = $(document.createElement("img"));
        $throbber.attr("src", chrome.extension.getURL("throbber.gif"));
        $(this).html($throbber);
        $anchor = $(this);
        request_obj = {
          method: "torrent-add",
          arguments: {
            filename: url
          }
        };
        var retries = 4;
        var fail_fxn = function(xhr) {
          retries--;
          if (retries <= 0) {
            $fail_icon = $(document.createElement("img"));
            $fail_icon.attr("src", chrome.extension.getURL("stop32.png"));
            $anchor.html($fail_icon);
            return;
          }
          transmission_session_id = xhr.getResponseHeader("X-Transmission-Session-Id");
          this.headers["X-Transmission-Session-Id"] = transmission_session_id;
          $.ajax(this).fail(fail_fxn);
        }
        $.ajax({
          url: "http://bt.cshaus.com/transmission/rpc",
          data: JSON.stringify(request_obj),
          contentType: "application/json; charset=utf-8",
          type: "POST",
          headers: {
            "X-Transmission-Session-Id": transmission_session_id
          },
          success: function(data) {
            $success_icon = $(document.createElement("img"));
            $success_icon.attr("src", chrome.extension.getURL("check32.png"));
            $anchor.html($success_icon);
          },
        }).fail(fail_fxn);
      });
    };

    $("tr.group_torrent>td>span>a[href*=torrents]").each(mod_fxn);
    // hack to make it work with animebyt.es
    $("tr.group_torrent>td>span>span>a[href*=torrents2]").each(mod_fxn);
  });
})();
