(function() {
  var sb_rpc_path = "http://bt.cshaus.com/transmission/rpc";

  client = new transmission.Client(sb_rpc_path);

  function qualifyURL(url) {
    var img = document.createElement('img');
    img.src = url; // set string url
    var url = img.src; // get qualified url
    img.src = null; // no server request
    return url;
  }

  $(document).ready(function() {
    var mod_f = function() {
      var $this = $(this);
      var href = $this.attr("href");
      var url = qualifyURL(href);
      var $new_anchor = $(document.createElement("a"));
      $new_anchor.attr("href", "#");
      $new_anchor.html("SB");
      $this.after($new_anchor).after(" | ");
      $new_anchor.click(function(event) {
        event.preventDefault();
        $(this).html(chrome.extension.getURL("throbber.gif"));
        var $throbber = $(document.createElement("img"));
        $throbber.attr("src", chrome.extension.getURL("throbber.gif"));
        $(this).html($throbber);
        var $anchor = $(this);

        var fail_f = function(data, textStatus, errThrown) {
          var $fail_icon = $(document.createElement("img"));
          $fail_icon.attr("src", chrome.extension.getURL("stop16.png"));
          $anchor.html($fail_icon);

          console.log("transmission communication failed: ");
          console.log(errThrown);
          return;
        }

        var done_f = function(result, arguments, tag) {
          // if the result isn't a success or a duplicate
          if (result != "success" && result != "duplicate torrent") {
            console.log("transmission returned result: " + result);
            fail_f();
            return;
          }

          var $success_icon = $(document.createElement("img"));
          $success_icon.attr("src", chrome.extension.getURL("check16.png"));
          $anchor.html($success_icon);
        }

        client.request("torrent-add", {filename: url}, done_f, fail_f);
      });
    };

    $("tr.group_torrent>td>span>a[href*=torrents\\.php\\?action\\=download]").each(mod_f);
    // hack to make it work with animebyt.es
    $("tr.group_torrent>td>span>span>a[href*=torrents2\\.php]").each(mod_f);
    $("tr.group_torrent>td>span>a[href*=torrents2\\.php]").each(mod_f);
  });
})();
